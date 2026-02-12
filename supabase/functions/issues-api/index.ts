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

    if (!buildingId) {
      return new Response(JSON.stringify({ error: "No building ID in token" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const method = req.method;
    const issueId = url.searchParams.get("id");

    // GET - List issues for building
    if (method === "GET") {
      const status = url.searchParams.get("status");
      
      let query = supabase
        .from("issues")
        .select("*")
        .eq("building_id", buildingId)
        .order("opened_at", { ascending: false });

      if (status) {
        query = query.eq("status", status);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching issues:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ issues: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST - Create new issue or update issue
    if (method === "POST") {
      const body = await req.json();
      
      // Handle update action
      if (body.action === "update" && body.id) {
        const updates: Record<string, unknown> = {};
        if (body.status === "resolved") {
          updates.status = "resolved";
          updates.closed_at = new Date().toISOString();
        } else if (body.status === "open") {
          updates.status = "open";
          updates.closed_at = null;
        }

        const { data, error } = await supabase
          .from("issues")
          .update(updates)
          .eq("id", body.id)
          .eq("building_id", buildingId)
          .select()
          .single();

        if (error) {
          console.error("Error updating issue:", error);
          return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        console.log("Updated issue:", data.id, "status:", data.status);
        return new Response(JSON.stringify({ issue: data }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Create new issue
      const { data, error } = await supabase
        .from("issues")
        .insert({
          building_id: buildingId,
          title: body.title,
          description: body.description,
          location: body.location,
          priority: body.priority || "medium",
          status: "open",
          form_name: body.formName,
          inspection_id: body.inspectionId,
          opened_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating issue:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("Created issue:", data.id);
      return new Response(JSON.stringify({ issue: data }), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }


    // DELETE - Clear all issues for building
    if (method === "DELETE") {
      const { error } = await supabase
        .from("issues")
        .delete()
        .eq("building_id", buildingId);

      if (error) {
        console.error("Error deleting issues:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("Cleared all issues for building:", buildingId);
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
