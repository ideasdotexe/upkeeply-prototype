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

    // Parse JWT to get user info
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
    const formId = url.searchParams.get("formId");

    // GET - Get template customization for a form
    if (method === "GET") {
      if (!formId) {
        return new Response(JSON.stringify({ error: "Form ID required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase
        .from("template_customizations")
        .select("*")
        .eq("building_id", buildingId)
        .eq("form_id", formId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching customization:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ customization: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST/PUT - Save template customization
    if (method === "POST" || method === "PUT") {
      const body = await req.json();
      
      if (!body.formId) {
        return new Response(JSON.stringify({ error: "Form ID required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase
        .from("template_customizations")
        .upsert({
          building_id: buildingId,
          form_id: body.formId,
          custom_items: body.customItems || {},
          removed_items: body.removedItems || {},
          updated_by: userId,
        }, {
          onConflict: "building_id,form_id",
        })
        .select()
        .single();

      if (error) {
        console.error("Error saving customization:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("Saved customization for form:", body.formId, "building:", buildingId);
      return new Response(JSON.stringify({ customization: data }), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE - Clear customization for a form
    if (method === "DELETE") {
      if (!formId) {
        return new Response(JSON.stringify({ error: "Form ID required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { error } = await supabase
        .from("template_customizations")
        .delete()
        .eq("building_id", buildingId)
        .eq("form_id", formId);

      if (error) {
        console.error("Error deleting customization:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("Cleared customization for form:", formId, "building:", buildingId);
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
