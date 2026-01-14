import {
  Smartphone,
  Save,
  FileText,
  Settings,
  Shield,
  Zap,
  Clock,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description:
      "Built for tablets and phones—carry all your building data in your pocket, not in 1000s of papers.",
  },
  {
    icon: Save,
    title: "Auto-Save & Sync",
    description:
      "Never lose progress. Forms auto-save every 30 seconds and sync across all devices.",
  },
  {
    icon: FileText,
    title: "Weekly PDF Reports",
    description:
      "Export inspection data as professional PDF reports—one page per week, ready to share.",
  },
  {
    icon: Settings,
    title: "Customizable Forms",
    description:
      "Add or remove checklist items to match your building's unique needs.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Your data is encrypted and stored securely—only accessible by your authorized team.",
  },
  {
    icon: Zap,
    title: "Smart Input Types",
    description:
      "Toggles for ON/OFF, number fields for temps/pressures—no more illegible handwriting.",
  },
  {
    icon: Clock,
    title: "Time-Stamped Records",
    description:
      "Every inspection is automatically dated and time-stamped for perfect audit trails.",
  },
  {
    icon: Users,
    title: "Multi-User Access",
    description:
      "Superintendents complete inspections, property managers review—everyone stays in sync.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Everything You Need to Ditch Paperwork
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border group hover:border-primary/20"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
