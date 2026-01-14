import { Clock, FileCheck, Eye, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Clock,
    value: "70%",
    label: "Time Saved",
    color: "text-primary",
  },
  {
    icon: FileCheck,
    value: "6 MIN",
    label: "Per Inspection",
    color: "text-success",
  },
  {
    icon: Eye,
    value: "100%",
    label: "Cloud-Based",
    color: "text-secondary",
  },
  {
    icon: TrendingUp,
    value: "$0",
    label: "Lost Forms",
    color: "text-accent",
  },
];

const StatsBar = () => {
  return (
    <section className="relative py-12 bg-card/50 border-y border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center group"
            >
              <div className="flex justify-center mb-3">
                <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
              <div className={`text-3xl md:text-4xl font-black ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
