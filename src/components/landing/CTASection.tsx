import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

const CTASection = () => {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-primary opacity-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(186_100%_50%_/_0.2),_transparent_60%)]" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-accent rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-primary/50 rounded-full animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-tight">
            Ready to <span className="gradient-text">Ditch the Paperwork</span>?
          </h2>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Join property managers who've already saved 1000+ hours.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={scrollToContact}
              className="gradient-accent text-accent-foreground font-bold text-xl px-12 py-8 rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 glow-accent"
            >
              Get Started
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary/50 text-primary hover:bg-primary/10 font-bold text-xl px-12 py-8 rounded-xl transition-all duration-300"
            >
              Watch 2-Min Demo
            </Button>
          </div>
          
          {/* Urgency element */}
          <div className="mt-10 inline-flex items-center gap-2 px-5 py-3 bg-accent/10 rounded-full text-accent font-semibold">
            <Zap className="h-5 w-5" />
            Limited spots available for beta access
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
