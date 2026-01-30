import { FileX, Eye, Clock, Search } from "lucide-react";

const problems = [
  {
    icon: FileX,
    title: "Paper Forms Get Lost or Damaged",
    description:
      "Inspection forms get misplaced, coffee-stained, or are impossible to read. Critical information disappears when you need it most.",
  },
  {
    icon: Search,
    title: "Can't Find Past Inspections",
    description:
      "Filing cabinet chaos means you're digging for hours when auditors show up or when you need to prove a recurring issue.",
  },
  {
    icon: Clock,
    title: "Board Reports Take Hours",
    description:
      "Compiling monthly reports manually eats 2+ hours. Re-entering data, hunting down forms, formatting spreadsheets. Time you'll never get back.",
  },
  {
    icon: Eye,
    title: "No Visibility Into Recurring Issues",
    description:
      "The elevator keeps breaking, but you have no data to prove it. No visibility means no leverage for repairs or replacements.",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-20 md:py-28 bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Still Managing Properties With Paper?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            You're not alone—but you're wasting time and losing data every single day.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 shadow-card hover:shadow-card-hover transition-shadow duration-300 border border-border"
            >
              <div className="w-12 h-12 bg-destructive/10 rounded-xl flex items-center justify-center mb-5">
                <problem.icon className="h-6 w-6 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {problem.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
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
