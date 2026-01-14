import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LandingHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold gradient-text">
          Upkeeply
        </Link>
        <Button 
          variant="outline" 
          asChild
          className="border-primary/50 text-primary hover:bg-primary/10 hover:border-primary transition-all duration-300"
        >
          <Link to="/form/daily-maintenance">Login</Link>
        </Button>
      </div>
    </header>
  );
};

export default LandingHeader;
