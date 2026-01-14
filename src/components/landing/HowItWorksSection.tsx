import { ClipboardCheck, Cloud, FileText, ArrowRight } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: ClipboardCheck,
    title: "Fill Out Inspections on Your Phone",
    description:
      "Walk your building with a tablet or phone. Complete inspections in 6 minutes with smart forms that auto-save.",
  },
  {
    number: 2,
    icon: Cloud,
    title: "Everything Syncs Instantly",
    description:
      "All data is stored securely in the cloud. No more lost forms—everything is searchable and accessible anytime.",
  },
  {
    number: 3,
    icon: FileText,
    title: "Export Reports in One Click",
    description:
      "Generate weekly or monthly PDF reports instantly. Share with your team, property managers, or auditors.",
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Go Paperless in 3 Simple Steps
          </h2>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border h-full">
                  {/* Step number badge */}
                  <div className="absolute -top-4 left-8 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-md">
                    {step.number}
                  </div>

                  <div className="pt-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                      <step.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Arrow for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center py-4">
                    <ArrowRight className="h-6 w-6 text-primary/40 rotate-90" />
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
