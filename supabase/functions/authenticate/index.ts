import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple hash function for password comparison
// In production, use bcrypt or argon2 - this is a migration step
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

interface LoginRequest {
  companyId: string;
  buildingId: string;
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    companyId: string;
    buildingId: string;
    username: string;
    fullName: string | null;
    designation: string;
    email: string | null;
  };
  sessionToken?: string;
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
    
    // Use service role key to access users table (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: LoginRequest = await req.json();
    const { companyId, buildingId, username, password } = body;

    // Input validation
    if (!companyId || !buildingId || !username || !password) {
      console.log("Authentication failed: Missing required fields");
      return new Response(
        JSON.stringify({ success: false, message: "All fields are required" } as LoginResponse),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate input lengths to prevent abuse
    if (companyId.length > 100 || buildingId.length > 100 || username.length > 100 || password.length > 100) {
      console.log("Authentication failed: Input too long");
      return new Response(
        JSON.stringify({ success: false, message: "Invalid input" } as LoginResponse),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Sanitize and normalize inputs
    const normalizedCompanyId = companyId.trim().toLowerCase();
    const normalizedBuildingId = buildingId.trim().toLowerCase();
    const normalizedUsername = username.trim().toLowerCase();

    console.log(`Authentication attempt for user: ${normalizedUsername} at company: ${normalizedCompanyId}`);

    // Query user from database (server-side, not exposed to client)
    const { data: user, error } = await supabase
      .from("users")
      .select("id, company_id, building_id, username, password_hash, full_name, designation, email")
      .eq("company_id", normalizedCompanyId)
      .eq("building_id", normalizedBuildingId)
      .eq("username", normalizedUsername)
      .maybeSingle();

    if (error) {
      console.error("Database error during authentication:", error.message);
      return new Response(
        JSON.stringify({ success: false, message: "Authentication service unavailable" } as LoginResponse),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!user) {
      console.log(`Authentication failed: User not found - ${normalizedUsername}`);
      // Generic error message to prevent user enumeration
      return new Response(
        JSON.stringify({ success: false, message: "Invalid credentials" } as LoginResponse),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Compare password (currently stored as plaintext, will be hashed)
    // For migration: check both plaintext and hashed versions
    const hashedInputPassword = await hashPassword(password);
    const passwordMatches = user.password_hash === password || user.password_hash === hashedInputPassword;

    if (!passwordMatches) {
      console.log(`Authentication failed: Invalid password for user - ${normalizedUsername}`);
      return new Response(
        JSON.stringify({ success: false, message: "Invalid credentials" } as LoginResponse),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Generate a simple session token (in production, use JWT with proper signing)
    const sessionToken = crypto.randomUUID();
    
    console.log(`Authentication successful for user: ${normalizedUsername}`);

    const response: LoginResponse = {
      success: true,
      message: "Authentication successful",
      user: {
        id: user.id,
        companyId: user.company_id,
        buildingId: user.building_id,
        username: user.username,
        fullName: user.full_name,
        designation: user.designation,
        email: user.email,
      },
      sessionToken,
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error during authentication:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" } as LoginResponse),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
