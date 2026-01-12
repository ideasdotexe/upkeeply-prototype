import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle, AlertCircle, Minus, Power, PowerOff, Lock, Unlock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChecklistItem as ChecklistItemType } from "@/lib/formTemplates";

interface CombinedValue {
  identifier?: string;
  status?: boolean | null;
}

interface ChecklistItemProps {
  item: ChecklistItemType;
  value: string | boolean | number | CombinedValue | null;
  onChange: (value: string | boolean | number | CombinedValue | null) => void;
  note?: string;
  onNoteChange?: (note: string) => void;
  onRemove?: () => void;
  canRemove?: boolean;
}

export function ChecklistItem({
  item,
  value,
  onChange,
  note,
  onNoteChange,
  onRemove,
  canRemove = false,
}: ChecklistItemProps) {
  const [showNote, setShowNote] = useState(!!note);

  const renderToggleButtons = (
    currentValue: boolean | null | undefined,
    onToggle: (val: boolean | null) => void,
    type: "on-off" | "open-closed" | "pass-fail" | "ok-issue" = "on-off"
  ) => {
    const configs = {
      "on-off": {
        trueLabel: "ON",
        falseLabel: "OFF",
        trueIcon: Power,
        falseIcon: PowerOff,
        trueClass: "bg-success hover:bg-success/90 text-success-foreground",
        falseClass: "bg-muted hover:bg-muted/90 text-muted-foreground",
      },
      "open-closed": {
        trueLabel: "OPEN",
        falseLabel: "CLOSED",
        trueIcon: Unlock,
        falseIcon: Lock,
        trueClass: "bg-success hover:bg-success/90 text-success-foreground",
        falseClass: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
      },
      "pass-fail": {
        trueLabel: "Pass",
        falseLabel: "Fail",
        trueIcon: CheckCircle,
        falseIcon: XCircle,
        trueClass: "bg-success hover:bg-success/90 text-success-foreground",
        falseClass: "bg-destructive hover:bg-destructive/90 text-destructive-foreground",
      },
      "ok-issue": {
        trueLabel: "OK",
        falseLabel: "Issue",
        trueIcon: CheckCircle,
        falseIcon: AlertCircle,
        trueClass: "bg-success hover:bg-success/90 text-success-foreground",
        falseClass: "bg-warning hover:bg-warning/90 text-warning-foreground",
      },
    };

    const config = configs[type];
    const TrueIcon = config.trueIcon;
    const FalseIcon = config.falseIcon;

    return (
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="sm"
          variant={currentValue === true ? "default" : "outline"}
          className={cn(
            "gap-1 h-8 px-2 text-xs transition-all",
            currentValue === true && config.trueClass
          )}
          onClick={() => onToggle(currentValue === true ? null : true)}
        >
          <TrueIcon className="h-3.5 w-3.5" />
          {config.trueLabel}
        </Button>
        <Button
          type="button"
          size="sm"
          variant={currentValue === false ? "default" : "outline"}
          className={cn(
            "gap-1 h-8 px-2 text-xs transition-all",
            currentValue === false && config.falseClass
          )}
          onClick={() => onToggle(currentValue === false ? null : false)}
        >
          <FalseIcon className="h-3.5 w-3.5" />
          {config.falseLabel}
        </Button>
      </div>
    );
  };

  const renderInput = () => {
    switch (item.type) {
      case "combined-toggle": {
        const combinedValue = (value as CombinedValue) || {};
        return (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                {item.identifierLabel || "#"}
              </span>
              <Input
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                value={combinedValue.identifier || ""}
                onChange={(e) => {
                  // Only allow numbers
                  const numValue = e.target.value.replace(/[^0-9]/g, "");
                  onChange({
                    ...combinedValue,
                    identifier: numValue || undefined,
                  });
                }}
                className="w-20 h-8 text-sm"
                placeholder="#"
              />
            </div>
            {renderToggleButtons(
              combinedValue.status,
              (val) => onChange({ ...combinedValue, status: val }),
              item.toggleType || "on-off"
            )}
          </div>
        );
      }

      case "select":
        return (
          <Select
            value={value as string || ""}
            onValueChange={(val) => onChange(val || null)}
          >
            <SelectTrigger className="w-24 h-8 text-sm">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {item.selectOptions?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "pass-fail":
        return renderToggleButtons(value as boolean | null, (val) => onChange(val), "pass-fail");

      case "ok-issue":
        return renderToggleButtons(value as boolean | null, (val) => onChange(val), "ok-issue");

      case "on-off":
        return renderToggleButtons(value as boolean | null, (val) => onChange(val), "on-off");

      case "open-closed":
        return renderToggleButtons(value as boolean | null, (val) => onChange(val), "open-closed");

      case "number":
        return (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={value as number ?? ""}
              onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
              className="w-24 h-8 text-sm"
              placeholder="0"
            />
            {item.unit && (
              <span className="text-sm text-muted-foreground font-medium">{item.unit}</span>
            )}
          </div>
        );

      case "text":
        return (
          <Input
            type="text"
            value={value as string ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            className="max-w-xs h-8 text-sm"
            placeholder={item.placeholder || "Enter details..."}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={value as string ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            className="min-h-[80px] resize-none text-sm w-full"
            placeholder={item.placeholder || "Enter details..."}
          />
        );

      default:
        return null;
    }
  };

  const hasIssue = 
    (item.type === "combined-toggle" && (value as CombinedValue)?.status === false) ||
    (value === false && (item.type === "pass-fail" || item.type === "ok-issue" || item.type === "open-closed"));

  // For textarea without label, render full-width
  if (item.type === "textarea" && !item.label) {
    return (
      <div className={cn(
        "rounded-md border px-3 py-2.5 transition-all",
        hasIssue ? "border-warning/50 bg-warning/5" : "border-border/50 bg-card/50"
      )}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {renderInput()}
          </div>
          {canRemove && onRemove && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive shrink-0"
              onClick={onRemove}
              title="Remove item"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "rounded-md border px-3 py-2.5 transition-all",
      hasIssue ? "border-warning/50 bg-warning/5" : "border-border/50 bg-card/50"
    )}>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Label */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-sm font-medium text-foreground">{item.label}</span>
          {item.required && (
            <span className="text-destructive text-xs">*</span>
          )}
        </div>

        {/* Input */}
        <div className="flex items-center gap-2">
          {renderInput()}
          
          {/* Actions */}
          {item.type !== "textarea" && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              onClick={() => setShowNote(!showNote)}
              title={showNote ? "Hide note" : "Add note"}
            >
              <Minus className={cn("h-3.5 w-3.5 transition-transform", showNote && "rotate-0", !showNote && "rotate-90")} />
            </Button>
          )}
          
          {canRemove && onRemove && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              onClick={onRemove}
              title="Remove item"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Note Field */}
      {showNote && item.type !== "textarea" && (
        <div className="mt-2 pt-2 border-t border-border/30">
          <Textarea
            value={note || ""}
            onChange={(e) => onNoteChange?.(e.target.value)}
            className="min-h-[50px] resize-none text-sm"
            placeholder="Add a note..."
          />
        </div>
      )}
    </div>
  );
}