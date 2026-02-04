import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify JWT token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "No authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse JWT to get user info (we use custom JWT, not Supabase auth)
    const token = authHeader.replace("Bearer ", "");
    let payload;
    try {
      const parts = token.split(".");
      payload = JSON.parse(atob(parts[1]));
    } catch {
      return new Response(JSON.stringify({ error: "Invalid token" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const buildingId = payload.buildingId;
    const userId = payload.userId;

    if (!buildingId) {
      return new Response(JSON.stringify({ error: "No building ID in token" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const method = req.method;

    // GET - Get draft for a specific form
    if (method === "GET") {
      const formId = url.searchParams.get("formId");
      
      if (!formId) {
        return new Response(JSON.stringify({ error: "formId is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase
        .from("drafts")
        .select("*")
        .eq("building_id", buildingId)
        .eq("form_id", formId)
        .single();

      if (error && error.code !== "PGRST116") {
        console.error("Error fetching draft:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ draft: data || null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST/PUT - Save or update draft (upsert)
    if (method === "POST" || method === "PUT") {
      const body = await req.json();
      const formId = body.formId;

      if (!formId) {
        return new Response(JSON.stringify({ error: "formId is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase
        .from("drafts")
        .upsert({
          building_id: buildingId,
          form_id: formId,
          responses: body.responses || {},
          custom_sections: body.customSections || [],
          removed_items: body.removedItems || {},
          updated_by: userId,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "building_id,form_id",
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving draft:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("Saved draft for form:", formId, "building:", buildingId);
      return new Response(JSON.stringify({ draft: data, success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE - Delete draft for a specific form
    if (method === "DELETE") {
      const formId = url.searchParams.get("formId");
      
      if (!formId) {
        return new Response(JSON.stringify({ error: "formId is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await supabase
        .from("drafts")
        .delete()
        .eq("building_id", buildingId)
        .eq("form_id", formId);

      if (error) {
        console.error("Error deleting draft:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("Deleted draft for form:", formId);
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
