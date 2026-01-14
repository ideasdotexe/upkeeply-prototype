import { Smartphone, Cloud, FileOutput, ArrowDown } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Smartphone,
    title: "Inspect on Your Phone",
    description:
      "Walk the building with your phone. Smart forms auto-save every 30 seconds. No more clipboards, no more paper.",
    gradient: "from-primary to-secondary",
    glow: "glow-primary",
  },
  {
    number: "02",
    icon: Cloud,
    title: "Everything Syncs Instantly",
    description:
      "All data lives in the cloud. Search any inspection in seconds. Property managers see updates in real-time.",
    gradient: "from-secondary to-accent",
    glow: "glow-secondary",
  },
  {
    number: "03",
    icon: FileOutput,
    title: "Export Perfect Reports",
    description:
      "One-click PDF exports. Weekly grids ready for audits. No more manual compilation.",
    gradient: "from-accent to-primary",
    glow: "glow-accent",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-muted/30">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_hsl(186_100%_50%_/_0.03)_0%,_transparent_50%)]" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
            Go Paperless in <span className="gradient-text">3 Steps</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Seriously, that's it. No training required.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-24 left-[20%] right-[20%] h-1">
              <div className="w-full h-full bg-gradient-to-r from-primary via-secondary to-accent rounded-full opacity-30" />
            </div>

            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div className={`relative rounded-3xl p-8 bg-card border border-border overflow-hidden transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl ${step.glow.replace('glow', 'hover:glow')}`}>
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  <div className="relative z-10">
                    {/* Step number */}
                    <div className={`inline-block text-6xl font-black bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent mb-6`}>
                      {step.number}
                    </div>

                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {step.title}
                    </h3>
                    
                    <p className="text-muted-foreground leading-relaxed text-lg">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center py-6">
                    <ArrowDown className="h-8 w-8 text-primary/40" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
