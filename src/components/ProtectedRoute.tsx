import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const loginInfo = localStorage.getItem("loginInfo");
  
  if (!loginInfo) {
    return <Navigate to="/login" replace />;
  }
  
  try {
    const parsed = JSON.parse(loginInfo);
    // Validate required fields exist
    if (!parsed.sessionToken || !parsed.userId) {
      localStorage.removeItem("loginInfo");
      return <Navigate to="/login" replace />;
    }
    
    // Check if token appears to be a JWT (basic format check)
    const tokenParts = parsed.sessionToken.split(".");
    if (tokenParts.length !== 3) {
      localStorage.removeItem("loginInfo");
      return <Navigate to="/login" replace />;
    }
    
    // Decode and check expiration (client-side check for UX)
    try {
      const payload = JSON.parse(atob(tokenParts[1]));
      const exp = payload.exp;
      if (exp && Date.now() >= exp * 1000) {
        // Token expired
        localStorage.removeItem("loginInfo");
        return <Navigate to="/login" replace />;
      }
    } catch {
      // If we can't decode, let the server validate
    }
  } catch {
    localStorage.removeItem("loginInfo");
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}
