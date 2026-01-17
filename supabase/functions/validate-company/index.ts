import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ValidateCompanyRequest {
  companyId: string;
}

interface ValidateCompanyResponse {
  success: boolean;
  valid: boolean;
  message: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, valid: false, message: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Use service role key to access users table (bypasses RLS)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const body: ValidateCompanyRequest = await req.json();
    const { companyId } = body;

    // Input validation
    if (!companyId) {
      return new Response(
        JSON.stringify({ success: false, valid: false, message: "Company ID is required" } as ValidateCompanyResponse),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate input length
    if (companyId.length > 100) {
      return new Response(
        JSON.stringify({ success: false, valid: false, message: "Invalid input" } as ValidateCompanyResponse),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const normalizedCompanyId = companyId.trim().toLowerCase();

    console.log(`Validating company ID: ${normalizedCompanyId}`);

    // Check if company exists (only return boolean, not user data)
    const { count, error } = await supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("company_id", normalizedCompanyId);

    if (error) {
      console.error("Database error during company validation:", error.message);
      return new Response(
        JSON.stringify({ success: false, valid: false, message: "Validation service unavailable" } as ValidateCompanyResponse),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const isValid = (count ?? 0) > 0;
    console.log(`Company validation result for ${normalizedCompanyId}: ${isValid}`);

    const response: ValidateCompanyResponse = {
      success: true,
      valid: isValid,
      message: isValid ? "Valid company ID" : "Invalid company ID",
    };

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Unexpected error during company validation:", err);
    return new Response(
      JSON.stringify({ success: false, valid: false, message: "Internal server error" } as ValidateCompanyResponse),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
