import { Smartphone, BarChart3, FileDown, ArrowRight } from "lucide-react";

const steps = [
  {
    number: 1,
    icon: Smartphone,
    color: "primary",
    title: "Complete Inspections On-Site",
    description:
      "Superintendents use their phones or tablets to complete daily, weekly, or monthly checklists. Add photos and notes right where issues are found.",
  },
  {
    number: 2,
    icon: BarChart3,
    color: "accent",
    title: "Track Everything in Real-Time",
    description:
      "Problems are automatically flagged and tracked across all buildings. Property managers see exactly what needs attention without waiting for paper forms.",
  },
  {
    number: 3,
    icon: FileDown,
    color: "primary",
    title: "Create Board Reports in Minutes",
    description:
      "At month-end, generate comprehensive reports with one click. Include all completed inspections, flagged issues, trends, and photos. Done.",
  },
];

const stepColors = {
  primary: {
    bg: "bg-primary",
    iconBg: "bg-primary/10",
    icon: "text-primary",
  },
  accent: {
    bg: "bg-accent",
    iconBg: "bg-accent/10",
    icon: "text-accent",
  },
};

const HowItWorksSection = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Go Paperless in 3 Simple Steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From inspection to report—effortless, fast, and completely digital.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30" />

            {steps.map((step, index) => {
              const colors = stepColors[step.color as keyof typeof stepColors];
              return (
                <div key={index} className="relative">
                  <div className="bg-card rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border h-full">
                    {/* Step number badge */}
                    <div className={`absolute -top-4 left-8 w-8 h-8 ${colors.bg} text-primary-foreground rounded-full flex items-center justify-center font-bold text-sm shadow-md`}>
                      {step.number}
                    </div>

                    <div className="pt-4">
                      <div className={`w-14 h-14 ${colors.iconBg} rounded-xl flex items-center justify-center mb-6`}>
                        <step.icon className={`h-7 w-7 ${colors.icon}`} />
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
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
