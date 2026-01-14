import {
  ToggleLeft,
  Hash,
  CheckCircle2,
  MessageSquare,
  Clock,
} from "lucide-react";

const ProductShowcaseSection = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Built for Real Property Managers
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Clean, intuitive, and designed to save you time—not waste it.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* App mockup */}
          <div className="bg-card rounded-2xl shadow-card-hover border border-border overflow-hidden">
            <div className="bg-primary p-4 flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
                <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
                <div className="w-3 h-3 rounded-full bg-primary-foreground/20" />
              </div>
              <span className="text-primary-foreground font-medium text-sm">
                Daily Maintenance Inspection
              </span>
            </div>

            <div className="p-6 space-y-4">
              {/* Sample form items */}
              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ToggleLeft className="h-5 w-5 text-primary" />
                  <span className="font-medium">Fire Pump Running</span>
                </div>
                <div className="px-3 py-1 bg-success/10 text-success text-sm rounded-full font-medium">
                  ON
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Hash className="h-5 w-5 text-primary" />
                  <span className="font-medium">System Pressure</span>
                </div>
                <div className="px-4 py-1 bg-muted text-foreground text-sm rounded-lg font-mono">
                  125 PSI
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-success" />
                  <span className="font-medium">Boiler Room Inspection</span>
                </div>
                <div className="px-3 py-1 bg-success/10 text-success text-sm rounded-full font-medium">
                  Completed
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span className="font-medium">Notes</span>
                </div>
                <div className="text-muted-foreground text-sm">
                  "All systems normal"
                </div>
              </div>

              {/* Auto-save indicator */}
              <div className="flex items-center justify-center gap-2 pt-4 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Auto-saved 5 seconds ago</span>
              </div>
            </div>
          </div>

          {/* Feature callouts */}
          <div className="grid sm:grid-cols-3 gap-4 mt-8">
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-primary mb-1">6 min</div>
              <div className="text-sm text-muted-foreground">
                Average inspection time
              </div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-primary mb-1">30 sec</div>
              <div className="text-sm text-muted-foreground">Auto-save interval</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-primary mb-1">1 click</div>
              <div className="text-sm text-muted-foreground">PDF export</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcaseSection;
