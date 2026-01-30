import {
  ClipboardCheck,
  AlertTriangle,
  FileText,
  TrendingUp,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: ClipboardCheck,
    color: "primary",
    title: "Replace Paper Checklists Forever",
    description:
      "Superintendents complete daily, weekly, and monthly inspections on their phones or tablets. No more lost forms, no more illegible handwriting, no more filing cabinets.",
  },
  {
    icon: AlertTriangle,
    color: "accent",
    title: "Flag and Track Problems in Real-Time",
    description:
      "Every issue is automatically logged and tracked. See open issues across all your properties at a glance. No more surprises, no more dropped balls.",
  },
  {
    icon: FileText,
    color: "primary",
    title: "Board Reports in Minutes, Not Hours",
    description:
      "Generate comprehensive board reports at the end of each month with one click. Export to PDF or Excel. Get back those 2+ hours every month.",
  },
  {
    icon: TrendingUp,
    color: "foreground",
    title: "Spot Recurring Problems Instantly",
    description:
      "See which issues keep coming up across buildings. Use data to justify repairs, replacements, or process changes. Turn anecdotes into evidence.",
  },
  {
    icon: Smartphone,
    color: "accent",
    title: "Works Wherever Your Team Works",
    description:
      "Superintendents work from basements, rooftops, and parking garages. Upkeeply works seamlessly on phones, tablets, and computers—online or offline.",
  },
];

const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    hover: "group-hover:bg-primary/20",
    icon: "text-primary",
    border: "hover:border-primary/20",
  },
  accent: {
    bg: "bg-accent/10",
    hover: "group-hover:bg-accent/20",
    icon: "text-accent",
    border: "hover:border-accent/20",
  },
  foreground: {
    bg: "bg-foreground/10",
    hover: "group-hover:bg-foreground/15",
    icon: "text-foreground",
    border: "hover:border-foreground/20",
  },
};

const FeaturesSection = () => {
  return (
    <section className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            5 Ways Upkeeply Transforms Your Workflow
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to go paperless and stay organized.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses];
            return (
              <div
                key={index}
                className={`bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 border border-border group ${colors.border}`}
              >
                <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-5 ${colors.hover} transition-colors`}>
                  <feature.icon className={`h-7 w-7 ${colors.icon}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
