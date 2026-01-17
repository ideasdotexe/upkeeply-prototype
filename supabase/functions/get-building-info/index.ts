import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as jose from "https://deno.land/x/jose@v4.14.4/index.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GetBuildingRequest {
  buildingId: string;
  sessionToken: string;
}

interface BuildingInfo {
  name: string;
  address: string | null;
  building_type: string | null;
  year_built: number | null;
  units: number | null;
  floors: number | null;
  parking_spots: number | null;
  amenities: string | null;
}

interface GetBuildingResponse {
  success: boolean;
  message: string;
  building?: BuildingInfo;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, message: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const jwtSecret = Deno.env.get("JWT_SECRET");
    
    if (!jwtSecret) {
      console.error("JWT_SECRET not configured");
      return new Response(
        JSON.stringify({ success: false, message: "Server configuration error" } as GetBuildingResponse),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: GetBuildingRequest = await req.json();
    const { buildingId, sessionToken } = body;

    // Require session token
    if (!sessionToken) {
      return new Response(
        JSON.stringify({ success: false, message: "Authentication required" } as GetBuildingResponse),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate JWT token
    const secret = new TextEncoder().encode(jwtSecret);
    let payload: jose.JWTPayload;
    
    try {
      const verified = await jose.jwtVerify(sessionToken, secret);
      payload = verified.payload;
    } catch (jwtError) {
      console.log("JWT validation failed: Invalid or expired token");
      return new Response(
        JSON.stringify({ success: false, message: "Invalid or expired session" } as GetBuildingResponse),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Input validation
    if (!buildingId) {
      return new Response(
        JSON.stringify({ success: false, message: "Building ID is required" } as GetBuildingResponse),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate input length and format
    if (buildingId.length > 100 || !/^[a-z0-9\s\-_.]+$/i.test(buildingId)) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid building ID format" } as GetBuildingResponse),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedBuildingId = buildingId.trim().toLowerCase();
    const userBuildingId = (payload.buildingId as string || "").toLowerCase();

    // Authorization check: User can only access their own building
    if (normalizedBuildingId !== userBuildingId) {
      console.log("Authorization failed: Building access denied");
      return new Response(
        JSON.stringify({ success: false, message: "Access denied" } as GetBuildingResponse),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Fetching authorized building info");

    // Query building from database
    const { data: building, error } = await supabase
      .from("buildings")
      .select("name, address, building_type, year_built, units, floors, parking_spots, amenities")
      .eq("building_id", normalizedBuildingId)
      .maybeSingle();

    if (error) {
      console.error("Database error fetching building");
      return new Response(
        JSON.stringify({ success: false, message: "Service unavailable" } as GetBuildingResponse),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!building) {
      console.log("Building not found");
      return new Response(
        JSON.stringify({ success: false, message: "Building not found" } as GetBuildingResponse),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Building info retrieved successfully");

    const response: GetBuildingResponse = {
      success: true,
      message: "Building info retrieved",
      building,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error fetching building");
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" } as GetBuildingResponse),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
