import { ClipboardList, Smartphone, X, Check } from "lucide-react";

const beforeItems = [
  "Paper forms get lost or damaged",
  "Can't find past inspections",
  "Board reports take 2+ hours",
  "No visibility into recurring issues",
  "Photos disconnected from notes",
  "Audit preparation is a nightmare",
];

const afterItems = [
  "All inspections digital and accessible",
  "Search any inspection in seconds",
  "Reports generated in minutes",
  "Spot patterns and trends automatically",
  "Photos attached to every issue",
  "Audit-ready records always available",
];

const SolutionSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            The Old Way vs. The Upkeeply Way
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stop digging through filing cabinets. Stop retyping handwritten notes. 
            Stop losing track of recurring problems.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Before Card */}
          <div className="bg-muted/50 rounded-2xl p-8 border border-border">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center">
                <ClipboardList className="h-6 w-6 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-muted-foreground">
                  Before Upkeeply
                </h3>
                <p className="text-sm text-muted-foreground/70">Paper chaos & frustration</p>
              </div>
            </div>
            <ul className="space-y-4">
              {beforeItems.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="h-3 w-3 text-destructive" />
                  </div>
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* After Card */}
          <div className="bg-primary/5 rounded-2xl p-8 border-2 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary">
                    With Upkeeply
                  </h3>
                  <p className="text-sm text-primary/70">Digital simplicity</p>
                </div>
              </div>
              <ul className="space-y-4">
                {afterItems.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-foreground font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;
