import { FileX, Eye, Clock } from "lucide-react";

const problems = [
  {
    icon: FileX,
    title: "Lost or Illegible Forms",
    description:
      "Paper forms get misplaced, damaged, or are impossible to read. Critical information disappears when you need it most.",
  },
  {
    icon: Eye,
    title: "Zero Visibility",
    description:
      "You have no idea what's happening at your buildings in real-time. You're always reacting, never ahead.",
  },
  {
    icon: Clock,
    title: "Hours Wasted Every Week",
    description:
      "Compiling monthly reports, hunting down forms, re-entering data manually. Time you'll never get back.",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Still Managing Your Building With Paper?
          </h2>
          <p className="text-lg text-muted-foreground">
            You're Not Alone—But You're Wasting Time.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-8 shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-border"
            >
              <div className="w-14 h-14 bg-destructive/10 rounded-xl flex items-center justify-center mb-6">
                <problem.icon className="h-7 w-7 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {problem.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {problem.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
