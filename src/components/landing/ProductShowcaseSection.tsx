import {
  ToggleLeft,
  Hash,
  CheckCircle2,
  MessageSquare,
  Sparkles,
} from "lucide-react";

const ProductShowcaseSection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-muted/30">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(263_70%_58%_/_0.1),_transparent_60%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-semibold mb-6">
            <Sparkles className="h-4 w-4" />
            SEE IT IN ACTION
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
            Built for Real Property Managers
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Clean, intuitive, and designed to save you time—not waste it.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* App mockup */}
          <div className="relative">
            {/* Glow behind the mockup */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 blur-3xl -z-10 scale-95" />
            
            <div className="bg-card rounded-3xl shadow-2xl border border-border overflow-hidden">
              {/* Header bar */}
              <div className="gradient-primary p-5 flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-white/20" />
                  <div className="w-3.5 h-3.5 rounded-full bg-white/20" />
                  <div className="w-3.5 h-3.5 rounded-full bg-white/20" />
                </div>
                <span className="text-white font-bold text-lg">
                  Daily Maintenance Inspection
                </span>
              </div>

              <div className="p-8 space-y-5">
                {/* Sample form items */}
                <div className="flex items-center justify-between p-5 bg-muted/50 rounded-xl border border-border hover:border-primary/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <ToggleLeft className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-semibold text-lg">Fire Pump Running</span>
                  </div>
                  <div className="px-5 py-2 bg-success text-success-foreground text-sm rounded-full font-bold shadow-lg">
                    ON
                  </div>
                </div>

                <div className="flex items-center justify-between p-5 bg-muted/50 rounded-xl border border-border hover:border-primary/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Hash className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-semibold text-lg">System Pressure</span>
                  </div>
                  <div className="px-6 py-2 bg-card text-foreground text-lg rounded-lg font-mono font-bold border border-border">
                    125 PSI
                  </div>
                </div>

                <div className="flex items-center justify-between p-5 bg-muted/50 rounded-xl border border-border hover:border-primary/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    </div>
                    <span className="font-semibold text-lg">Boiler Room Inspection</span>
                  </div>
                  <div className="px-5 py-2 bg-success/10 text-success text-sm rounded-full font-bold">
                    Completed
                  </div>
                </div>

                <div className="flex items-center justify-between p-5 bg-muted/50 rounded-xl border border-border hover:border-primary/30 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-secondary" />
                    </div>
                    <span className="font-semibold text-lg">Notes</span>
                  </div>
                  <div className="text-muted-foreground italic">
                    "All systems normal"
                  </div>
                </div>

                {/* Auto-save indicator */}
                <div className="flex items-center justify-center gap-3 pt-4">
                  <div className="w-3 h-3 bg-success rounded-full animate-pulse shadow-lg shadow-success/50" />
                  <span className="text-muted-foreground font-medium">Auto-saved 5 seconds ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feature callouts */}
          <div className="grid sm:grid-cols-3 gap-6 mt-12">
            <div className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl font-black gradient-text mb-2">6 min</div>
              <div className="text-muted-foreground font-medium">
                Average inspection time
              </div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl font-black text-success mb-2">30 sec</div>
              <div className="text-muted-foreground font-medium">Auto-save interval</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl font-black text-secondary mb-2">1 click</div>
              <div className="text-muted-foreground font-medium">PDF export</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcaseSection;
