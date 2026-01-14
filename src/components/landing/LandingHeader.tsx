import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const LandingHeader = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          Upkeeply
        </Link>
        <Button variant="outline" asChild>
          <Link to="/form/daily-maintenance">Login</Link>
        </Button>
      </div>
    </header>
  );
};

export default LandingHeader;
