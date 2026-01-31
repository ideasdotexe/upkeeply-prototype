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

    // GET - List inspections for building
    if (method === "GET") {
      const date = url.searchParams.get("date");
      
      let query = supabase
        .from("inspections")
        .select("*")
        .eq("building_id", buildingId)
        .order("completed_at", { ascending: false });

      if (date) {
        // Filter by specific date
        const startOfDay = `${date}T00:00:00.000Z`;
        const endOfDay = `${date}T23:59:59.999Z`;
        query = query.gte("completed_at", startOfDay).lte("completed_at", endOfDay);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching inspections:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ inspections: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST - Create new inspection
    if (method === "POST") {
      const body = await req.json();
      
      const { data, error } = await supabase
        .from("inspections")
        .insert({
          building_id: buildingId,
          form_id: body.formId,
          form_name: body.formName,
          completed_at: body.completedAt || new Date().toISOString(),
          completed_by: userId,
          status: body.status || "completed",
          items_count: body.itemsCount || 0,
          issues_count: body.issuesCount || 0,
          responses: body.responses || {},
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating inspection:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("Created inspection:", data.id);
      return new Response(JSON.stringify({ inspection: data }), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE - Clear all inspections for building
    if (method === "DELETE") {
      const { error } = await supabase
        .from("inspections")
        .delete()
        .eq("building_id", buildingId);

      if (error) {
        console.error("Error deleting inspections:", error);
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      console.log("Cleared all inspections for building:", buildingId);
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
