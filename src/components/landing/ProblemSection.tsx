import { FileX, EyeOff, Clock, AlertTriangle } from "lucide-react";

const problems = [
  {
    icon: Clock,
    stat: "20 MIN",
    title: "Time Drain",
    description:
      "Wasted on clipboards, illegible handwriting, and manual data entry. That's 2+ hours every day.",
  },
  {
    icon: FileX,
    stat: "30%",
    title: "Lost Forms",
    description:
      "Get lost, damaged, or are impossible to read. Critical info disappears when you need it most.",
  },
  {
    icon: EyeOff,
    stat: "ZERO",
    title: "Visibility",
    description:
      "You have no idea what's happening at your buildings. You're flying blind and reacting late.",
  },
];

const ProblemSection = () => {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      {/* Background with danger vibe */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-destructive/5 to-background" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-destructive/10 rounded-full text-destructive text-sm font-semibold mb-6">
            <AlertTriangle className="h-4 w-4" />
            THE PROBLEM
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-foreground mb-6 leading-tight">
            You're Losing Hours to Paperwork.
            <br />
            <span className="text-destructive">Your Competition Isn't.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Every day you waste:
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="group relative rounded-2xl p-8 bg-card border border-destructive/20 hover:border-destructive/40 transition-all duration-300 hover:-translate-y-2"
            >
              {/* Glow effect on hover */}
              <div className="absolute inset-0 rounded-2xl bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 bg-destructive/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <problem.icon className="h-7 w-7 text-destructive" />
                </div>
                
                <div className="text-4xl md:text-5xl font-black text-destructive mb-2">
                  {problem.stat}
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-3">
                  {problem.title}
                </h3>
                
                <p className="text-muted-foreground leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
