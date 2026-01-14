import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Check, Clock, Zap } from "lucide-react";

const HeroSection = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="min-h-screen flex items-center pt-20 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 gradient-hero" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_hsl(186_100%_50%_/_0.15),_transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_hsl(263_70%_58%_/_0.15),_transparent_50%)]" />
      
      {/* Floating orbs */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Copy */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-foreground leading-none tracking-tight">
                <span className="block">STOP WASTING</span>
                <span className="block gradient-text">14 MINUTES</span>
                <span className="block">EVERY INSPECTION</span>
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-xl leading-relaxed">
              Upkeeply turns 20-minute inspections into <span className="text-primary font-semibold">6 minutes</span>.
              <br />
              <span className="text-foreground/80">Top property managers are already paperless. Are you?</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={scrollToContact}
                className="gradient-accent text-accent-foreground font-bold text-lg px-10 py-7 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 glow-accent"
              >
                Contact Us
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary/50 text-primary hover:bg-primary/10 font-semibold text-lg px-8 py-7 rounded-xl transition-all duration-300"
              >
                Watch Demo
              </Button>
            </div>
            
            {/* Trust indicators */}
            <div className="flex flex-wrap gap-6 pt-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-5 w-5 text-success" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-5 w-5 text-success" />
                <span>Setup in 5 minutes</span>
              </div>
            </div>
          </div>

          {/* Right side - Visual */}
          <div className="relative hidden lg:block">
            {/* Phone mockup */}
            <div className="relative z-10 animate-float">
              <div className="relative mx-auto w-[280px] h-[580px] bg-foreground/10 rounded-[3rem] p-3 backdrop-blur-sm border border-foreground/20">
                <div className="w-full h-full bg-card rounded-[2.5rem] overflow-hidden shadow-2xl">
                  {/* Phone notch */}
                  <div className="flex justify-center pt-2">
                    <div className="w-24 h-6 bg-foreground/20 rounded-full" />
                  </div>
                  
                  {/* App content */}
                  <div className="p-4 space-y-4 mt-2">
                    <div className="text-center mb-4">
                      <span className="text-xs text-primary font-semibold uppercase tracking-wider">Daily Inspection</span>
                      <h3 className="text-lg font-bold text-foreground mt-1">Building A - Unit 101</h3>
                    </div>
                    
                    {/* Form items */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-success/10 rounded-xl border border-success/20">
                        <span className="text-sm font-medium text-foreground">Fire Pump</span>
                        <span className="px-3 py-1 bg-success text-success-foreground text-xs font-bold rounded-full">ON</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted rounded-xl border border-border">
                        <span className="text-sm font-medium text-foreground">System PSI</span>
                        <span className="px-4 py-1 bg-primary/10 text-primary text-sm font-mono font-bold rounded-lg">125</span>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 bg-muted rounded-xl border border-border">
                        <span className="text-sm font-medium text-foreground">Boiler Room</span>
                        <Check className="h-5 w-5 text-success" />
                      </div>
                      
                      <div className="p-3 bg-primary/5 rounded-xl border border-primary/20">
                        <span className="text-xs text-muted-foreground block mb-1">Notes</span>
                        <span className="text-sm text-foreground">All systems normal ✓</span>
                      </div>
                    </div>
                    
                    {/* Auto-save indicator */}
                    <div className="flex items-center justify-center gap-2 text-xs text-primary mt-4">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                      <span>Auto-saved</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 p-4 glass rounded-2xl shadow-xl animate-bounce-subtle border border-primary/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/20 rounded-xl flex items-center justify-center">
                  <Clock className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Time Saved</p>
                  <p className="text-lg font-bold text-success">14 min</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-8 p-4 glass rounded-2xl shadow-xl animate-bounce-subtle border border-primary/30" style={{ animationDelay: '-1s' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                  <Zap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Inspection</p>
                  <p className="text-lg font-bold text-primary">6 min</p>
                </div>
              </div>
            </div>
            
            {/* Glow effects */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-primary/10 rounded-full blur-3xl -z-10" />
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden lg:block">
          <div className="w-6 h-10 rounded-full border-2 border-primary/50 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
