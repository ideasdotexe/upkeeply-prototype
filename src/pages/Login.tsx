import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, ArrowRight, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type LoginStep = "company" | "credentials";

const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<LoginStep>("company");
  
  // Step 1: Company ID
  const [companyId, setCompanyId] = useState("");
  
  // Step 2: Credentials
  const [buildingId, setBuildingId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyId.trim()) {
      toast.error("Please enter your Company ID");
      return;
    }

    setIsLoading(true);
    
    try {
      // Validate Company ID exists in database
      const { data: companyExists, error } = await supabase
        .from("users")
        .select("company_id")
        .eq("company_id", companyId.trim())
        .limit(1);

      if (error) {
        console.error("Company validation error:", error);
        toast.error("An error occurred. Please try again.");
        setIsLoading(false);
        return;
      }

      if (!companyExists || companyExists.length === 0) {
        toast.error("Invalid Company ID. Please check and try again.");
        setIsLoading(false);
        return;
      }

      // Move to credentials step
      setStep("credentials");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!buildingId.trim() || !username.trim() || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    
    try {
      // Query the users table to validate credentials
      const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("company_id", companyId.trim())
        .eq("building_id", buildingId.trim())
        .eq("username", username.trim())
        .eq("password_hash", password)
        .maybeSingle();

      if (error) {
        console.error("Login error:", error);
        toast.error("An error occurred during login. Please try again.");
        setIsLoading(false);
        return;
      }

      if (!user) {
        toast.error("Invalid credentials. Please check your Company ID, Building ID, username, and password.");
        setIsLoading(false);
        return;
      }

      // Successful login - store user info
      localStorage.setItem("loginInfo", JSON.stringify({
        companyId: user.company_id,
        buildingId: user.building_id,
        username: user.username,
        designation: user.designation,
        email: user.email,
        userId: user.id
      }));
      
      toast.success(`Welcome back, ${user.username}!`);
      navigate("/dashboard");
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setStep("company");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="block text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Upkeeply</h1>
        </Link>

        {step === "company" ? (
          /* Step 1: Company ID */
          <Card className="border-border shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-primary">What's your Company ID?</CardTitle>
              <CardDescription className="text-base mt-2">
                Your Company ID is unique to your workplace. It may have been given to you in a first-time access email. If not, please inquire with your administrator.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCompanySubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="companyId" className="font-semibold">Company ID</Label>
                  <Input
                    id="companyId"
                    type="text"
                    placeholder="Enter your company ID"
                    value={companyId}
                    onChange={(e) => setCompanyId(e.target.value)}
                    autoComplete="organization"
                    className="h-12"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base gap-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Validating..." : "Continue"}
                  {!isLoading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          /* Step 2: Building ID, Username, Password */
          <Card className="border-border shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Log in</CardTitle>
              <CardDescription>
                All fields are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="buildingId">Building ID</Label>
                  <Input
                    id="buildingId"
                    type="text"
                    placeholder="Enter building ID"
                    value={buildingId}
                    onChange={(e) => setBuildingId(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">User Name</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="h-12 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-base" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Login"}
                </Button>
              </form>

              <div className="mt-4">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full gap-2"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Company ID
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-sm text-muted-foreground mt-6">
          <Link to="/" className="hover:text-primary transition-colors">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
