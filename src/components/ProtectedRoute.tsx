import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  useEffect(() => {
    const checkAuth = () => {
      const loginInfo = localStorage.getItem("loginInfo");
      
      if (!loginInfo) {
        setAuthState("unauthenticated");
        return;
      }
      
      try {
        const parsed = JSON.parse(loginInfo);
        // Validate required fields exist
        if (!parsed.sessionToken || !parsed.userId) {
          localStorage.removeItem("loginInfo");
          setAuthState("unauthenticated");
          return;
        }
        
        // Check if token appears to be a JWT (basic format check)
        const tokenParts = parsed.sessionToken.split(".");
        if (tokenParts.length !== 3) {
          localStorage.removeItem("loginInfo");
          setAuthState("unauthenticated");
          return;
        }
        
        // Decode and check expiration (client-side check for UX)
        try {
          const payload = JSON.parse(atob(tokenParts[1]));
          const exp = payload.exp;
          if (exp && Date.now() >= exp * 1000) {
            // Token expired
            localStorage.removeItem("loginInfo");
            setAuthState("unauthenticated");
            return;
          }
        } catch {
          // If we can't decode, let the server validate
        }
        
        setAuthState("authenticated");
      } catch {
        localStorage.removeItem("loginInfo");
        setAuthState("unauthenticated");
      }
    };

    checkAuth();
  }, []);

  if (authState === "loading") {
    // Return null to prevent flash - the check is synchronous so this is very brief
    return null;
  }

  if (authState === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}
