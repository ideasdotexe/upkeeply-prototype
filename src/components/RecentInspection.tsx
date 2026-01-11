import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RecentInspectionProps {
  formName: string;
  date: string;
  status: "completed" | "draft" | "issues";
  itemsCount: number;
  issuesCount?: number;
}

export function RecentInspection({ 
  formName, 
  date, 
  status, 
  itemsCount,
  issuesCount 
}: RecentInspectionProps) {
  const statusConfig = {
    completed: {
      icon: CheckCircle2,
      label: "Completed",
      className: "bg-success/10 text-success border-success/20",
    },
    draft: {
      icon: Clock,
      label: "Draft",
      className: "bg-muted text-muted-foreground border-border",
    },
    issues: {
      icon: AlertCircle,
      label: `${issuesCount} Issues`,
      className: "bg-warning/10 text-warning border-warning/20",
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="flex items-center justify-between py-3 border-b border-border/50 last:border-0 group hover:bg-muted/30 -mx-4 px-4 transition-colors cursor-pointer">
      <div className="flex items-center gap-3">
        <div className={cn(
          "h-9 w-9 rounded-lg flex items-center justify-center",
          status === "completed" ? "bg-success/10" : status === "issues" ? "bg-warning/10" : "bg-muted"
        )}>
          <StatusIcon className={cn(
            "h-4 w-4",
            status === "completed" ? "text-success" : status === "issues" ? "text-warning" : "text-muted-foreground"
          )} />
        </div>
        <div>
          <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
            {formName}
          </p>
          <p className="text-xs text-muted-foreground">
            {date} · {itemsCount} items
          </p>
        </div>
      </div>
      <Badge variant="outline" className={cn("text-xs", config.className)}>
        {config.label}
      </Badge>
    </div>
  );
}
