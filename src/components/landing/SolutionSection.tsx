import { ClipboardList, Smartphone, X, Check, ArrowRight, Flame } from "lucide-react";

const beforeItems = [
  "20+ minutes per inspection",
  "Paper forms constantly lost",
  "Zero real-time visibility",
  "Hours wasted compiling reports",
  "Illegible handwriting errors",
  "Data buried in cabinets",
];

const afterItems = [
  "6 minutes per inspection",
  "100% cloud storage - never lose data",
  "Real-time visibility across all buildings",
  "1-click PDF exports - instant reports",
  "Structured data - no more guessing",
  "Mobile-first - phone, tablet, anywhere",
];

const SolutionSection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
            The Old Way Is <span className="text-destructive">Broken</span>.
            <br />
            <span className="gradient-text">We Fixed It.</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Before Card */}
          <div className="relative rounded-3xl p-8 md:p-10 bg-gradient-to-br from-muted to-card border border-border overflow-hidden group">
            {/* Danger overlay */}
            <div className="absolute inset-0 bg-destructive/5" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-destructive/10 rounded-2xl flex items-center justify-center">
                  <ClipboardList className="h-8 w-8 text-destructive" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-muted-foreground">
                    WITHOUT UPKEEPLY
                  </h3>
                  <p className="text-destructive font-semibold">The painful reality</p>
                </div>
              </div>
              
              <ul className="space-y-4">
                {beforeItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-4 group/item">
                    <div className="w-7 h-7 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="h-4 w-4 text-destructive" />
                    </div>
                    <span className="text-lg text-muted-foreground group-hover/item:text-foreground transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* After Card */}
          <div className="relative rounded-3xl p-8 md:p-10 overflow-hidden group">
            {/* Gradient background */}
            <div className="absolute inset-0 gradient-card" />
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10" />
            
            {/* Animated border */}
            <div className="absolute inset-0 rounded-3xl gradient-border" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-lg glow-primary">
                  <Smartphone className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground">
                    WITH UPKEEPLY
                  </h3>
                  <p className="text-primary font-semibold">The smart solution</p>
                </div>
              </div>
              
              <ul className="space-y-4">
                {afterItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-4 group/item">
                    <div className="w-7 h-7 rounded-full bg-success flex items-center justify-center flex-shrink-0 mt-0.5 shadow-lg">
                      <Check className="h-4 w-4 text-success-foreground" />
                    </div>
                    <span className="text-lg text-foreground font-medium group-hover/item:text-primary transition-colors">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Arrow indicator */}
        <div className="hidden lg:flex justify-center mt-8">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-sm font-medium">From chaos</span>
            <ArrowRight className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">to clarity</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
