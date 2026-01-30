import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";

const LandingHeader = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          Upkeeply
        </Link>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="default" 
            onClick={scrollToContact}
            className="hidden sm:inline-flex"
          >
            Book a Demo
          </Button>
          <Button variant="outline" asChild>
            <Link to="/login" className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;
