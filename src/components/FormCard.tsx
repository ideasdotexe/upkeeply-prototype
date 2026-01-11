import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ChevronRight } from "lucide-react";
import { FormTemplate } from "@/lib/formTemplates";
import { cn } from "@/lib/utils";

interface FormCardProps {
  template: FormTemplate;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export function FormCard({ template, onClick, className, style }: FormCardProps) {
  const Icon = template.icon;
  
  const frequencyColors = {
    daily: "bg-success/10 text-success border-success/20",
    weekly: "bg-info/10 text-info border-info/20",
    monthly: "bg-warning/10 text-warning border-warning/20",
  };

  return (
    <Card 
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 border-border/50 overflow-hidden",
        className
      )}
      style={style}
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex items-stretch">
          {/* Icon section */}
          <div className={cn(
            "flex items-center justify-center w-20 shrink-0",
            template.color
          )}>
            <Icon className="h-8 w-8 text-white" />
          </div>
          
          {/* Content section */}
          <div className="flex-1 p-4 flex flex-col justify-center min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                  {template.shortName}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-1 mt-0.5">
                  {template.description}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground/50 shrink-0 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
            
            {/* Meta info */}
            <div className="flex items-center gap-3 mt-3">
              <Badge 
                variant="outline" 
                className={cn("capitalize text-xs font-medium", frequencyColors[template.frequency])}
              >
                {template.frequency}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {template.estimatedTime}
              </span>
              <span className="text-xs text-muted-foreground">
                {template.items.length} items
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
