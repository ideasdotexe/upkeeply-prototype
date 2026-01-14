import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone } from "lucide-react";

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
              Top-performing buildings have one thing in common:{" "}
              <span className="text-primary">No paperwork.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              Upkeeply replaces clipboards, filing cabinets, and lost reports
              with one simple app your team will actually use.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={scrollToContact}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg px-8 py-6"
              >
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="relative">
            <div className="relative z-10 bg-card rounded-2xl shadow-card-hover p-4 border border-border">
              <div className="bg-primary/5 rounded-xl p-8 flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center">
                    <Smartphone className="h-10 w-10 text-primary" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Mobile-first inspection platform
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <span className="px-3 py-1 bg-success/10 text-success rounded-full font-medium">
                      6 min inspections
                    </span>
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium">
                      Auto-save
                    </span>
                  </div>
                </div>
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
