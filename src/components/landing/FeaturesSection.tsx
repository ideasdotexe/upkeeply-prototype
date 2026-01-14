import {
  Smartphone,
  Save,
  FileText,
  Settings,
  Shield,
  Zap,
  Clock,
  Users,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "Mobile-First",
    description: "Carry 1000 buildings in your pocket.",
    gradient: "from-primary to-info",
  },
  {
    icon: Save,
    title: "Never Lose Progress",
    description: "Auto-saves every 30 seconds.",
    gradient: "from-secondary to-accent",
  },
  {
    icon: FileText,
    title: "Instant PDF Reports",
    description: "Weekly grids ready in seconds.",
    gradient: "from-accent to-warning",
  },
  {
    icon: Settings,
    title: "Customize Everything",
    description: "Every building is different.",
    gradient: "from-success to-primary",
  },
  {
    icon: Shield,
    title: "Bank-Level Security",
    description: "Encrypted and GDPR compliant.",
    gradient: "from-info to-secondary",
  },
  {
    icon: Zap,
    title: "Works Offline",
    description: "Complete forms, sync later.",
    gradient: "from-warning to-accent",
  },
  {
    icon: Target,
    title: "Smart Form Fields",
    description: "No more illegible handwriting.",
    gradient: "from-accent to-destructive",
  },
  {
    icon: Clock,
    title: "Perfect Audit Trails",
    description: "Auto date and time-stamped.",
    gradient: "from-primary to-success",
  },
  {
    icon: Users,
    title: "Built for Teams",
    description: "Everyone stays synced.",
    gradient: "from-secondary to-info",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6">
            Everything You Need.
            <br />
            <span className="text-muted-foreground">Nothing You Don't.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative rounded-2xl p-6 bg-card border border-border overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:border-primary/30"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="relative z-10">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
