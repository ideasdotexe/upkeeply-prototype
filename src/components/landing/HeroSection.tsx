import { Button } from "@/components/ui/button";
import { ArrowRight, Monitor, Smartphone } from "lucide-react";

const HeroSection = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex items-center pt-20 bg-gradient-to-br from-background via-background to-secondary/30">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Copy */}
          <div className="space-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
              Property Inspections Made Simple, Organized, and{" "}
              <span className="text-primary">Paperless</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              The future of property management is paperless. Join the digital
              revolution with Upkeeply.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={scrollToContact}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 py-6"
              >
                Book a Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
            
            {/* Trust signals */}
            <div className="flex items-center gap-6 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">6 min</div>
                <div className="text-xs text-muted-foreground">avg inspection</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">2+ hrs</div>
                <div className="text-xs text-muted-foreground">saved monthly</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-xs text-muted-foreground">paperless</div>
              </div>
            </div>
          </div>

          {/* Right side - Product Visual */}
          <div className="relative">
            <div className="relative z-10 bg-card rounded-2xl shadow-card-hover p-6 border border-border">
              {/* Desktop + Mobile mockup illustration */}
              <div className="bg-primary/5 rounded-xl p-8 min-h-[400px]">
                <div className="flex items-end justify-center gap-4 h-full">
                  {/* Desktop mockup */}
                  <div className="relative bg-card rounded-lg shadow-lg border border-border p-3 w-[200px] hidden sm:block">
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-2 h-2 rounded-full bg-destructive/60" />
                      <div className="w-2 h-2 rounded-full bg-warning/60" />
                      <div className="w-2 h-2 rounded-full bg-success/60" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-primary/20 rounded w-3/4" />
                      <div className="h-2 bg-muted rounded w-full" />
                      <div className="h-2 bg-muted rounded w-5/6" />
                      <div className="h-6 bg-success/20 rounded mt-3" />
                      <div className="h-6 bg-primary/10 rounded" />
                      <div className="h-6 bg-primary/10 rounded" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2">
                      <Monitor className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  
                  {/* Mobile mockup */}
                  <div className="relative bg-card rounded-2xl shadow-lg border-2 border-foreground/10 p-2 w-[140px]">
                    <div className="bg-foreground/5 rounded-xl p-3 space-y-2">
                      <div className="h-2 bg-primary rounded w-2/3 mx-auto" />
                      <div className="space-y-1.5 mt-3">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-success/30" />
                          <div className="h-2 bg-muted rounded flex-1" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded bg-success/30" />
                          <div className="h-2 bg-muted rounded flex-1" />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border border-muted-foreground/30" />
                          <div className="h-2 bg-muted rounded flex-1" />
                        </div>
                      </div>
                      <div className="h-6 bg-accent/30 rounded mt-3" />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                      <Smartphone className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                
                {/* Caption */}
                <p className="text-center text-sm text-muted-foreground mt-8 font-medium">
                  Dashboard + Mobile Inspection
                </p>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
            <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
