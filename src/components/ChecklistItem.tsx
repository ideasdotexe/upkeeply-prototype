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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CheckCircle, XCircle, AlertCircle, Power, PowerOff, Lock, Unlock, Trash2, CalendarIcon, StickyNote, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChecklistItem as ChecklistItemType } from "@/lib/formTemplates";
import { format } from "date-fns";

interface CombinedValue {
  identifier?: string;
  status?: boolean | null;
}

interface ExtendedValue {
  mainValue?: string | boolean | number | CombinedValue | null;
  description?: string;
  actionBy?: string;
  completionDate?: string;
}

interface ChecklistItemProps {
  item: ChecklistItemType;
  value: ExtendedValue | null;
  onChange: (value: ExtendedValue | null) => void;
  onRemove?: () => void;
  canRemove?: boolean;
  showExtendedFields?: boolean;
  note?: string;
  onNoteChange?: (note: string) => void;
}

export function ChecklistItem({
  item,
  value,
  onChange,
  onRemove,
  canRemove = false,
  showExtendedFields = false,
  note = "",
  onNoteChange,
}: ChecklistItemProps) {
  const [dateOpen, setDateOpen] = useState(false);
  const [noteOpen, setNoteOpen] = useState(false);

  // Extract extended values with defaults
  const extendedValue: ExtendedValue = value || {};
  const mainValue = extendedValue.mainValue;
  const description = extendedValue.description || "";
  const actionBy = extendedValue.actionBy || "";
  const completionDate = extendedValue.completionDate || format(new Date(), "yyyy-MM-dd");

  const updateField = (field: keyof ExtendedValue, fieldValue: unknown) => {
    onChange({
      ...extendedValue,
      [field]: fieldValue,
      // Auto-fill completion date if not set
      completionDate: extendedValue.completionDate || format(new Date(), "yyyy-MM-dd"),
    });
  };

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

  const renderMainInput = () => {
    switch (item.type) {
      case "combined-toggle": {
        const combinedValue = (mainValue as CombinedValue) || {};
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
                  const numValue = e.target.value.replace(/[^0-9]/g, "");
                  updateField("mainValue", {
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
              (val) => updateField("mainValue", { ...combinedValue, status: val }),
              item.toggleType || "on-off"
            )}
          </div>
        );
      }

      case "select":
        return (
          <Select
            value={mainValue as string || ""}
            onValueChange={(val) => updateField("mainValue", val || null)}
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
        return renderToggleButtons(mainValue as boolean | null, (val) => updateField("mainValue", val), "pass-fail");

      case "ok-issue":
        return renderToggleButtons(mainValue as boolean | null, (val) => updateField("mainValue", val), "ok-issue");

      case "on-off":
        return renderToggleButtons(mainValue as boolean | null, (val) => updateField("mainValue", val), "on-off");

      case "open-closed":
        return renderToggleButtons(mainValue as boolean | null, (val) => updateField("mainValue", val), "open-closed");

      case "number":
        return (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={mainValue as number ?? ""}
              onChange={(e) => updateField("mainValue", e.target.value ? Number(e.target.value) : null)}
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
            value={mainValue as string ?? ""}
            onChange={(e) => updateField("mainValue", e.target.value || null)}
            className="max-w-xs h-8 text-sm"
            placeholder={item.placeholder || "Enter details..."}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={mainValue as string ?? ""}
            onChange={(e) => updateField("mainValue", e.target.value || null)}
            className="min-h-[80px] resize-none text-sm w-full"
            placeholder={item.placeholder || "Enter details..."}
          />
        );

      default:
        return null;
    }
  };

  const hasIssue = 
    (item.type === "combined-toggle" && (mainValue as CombinedValue)?.status === false) ||
    (mainValue === false && (item.type === "pass-fail" || item.type === "ok-issue" || item.type === "open-closed"));

  // For textarea without label, render full-width
  if (item.type === "textarea" && !item.label) {
    return (
      <div className={cn(
        "rounded-md border px-3 py-2.5 transition-all",
        hasIssue ? "border-warning/50 bg-warning/5" : "border-border/50 bg-card/50"
      )}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            {renderMainInput()}
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
      "rounded-md border px-3 py-3 transition-all",
      hasIssue ? "border-warning/50 bg-warning/5" : "border-border/50 bg-card/50"
    )}>
      {/* Row 1: Item Name and Status */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <span className="text-sm font-medium text-foreground">{item.label}</span>
          {item.required && (
            <span className="text-destructive text-xs">*</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {renderMainInput()}
          
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

      {/* Row 2: Description, Action By, Completion Date - Only show for forms with extended fields */}
      {showExtendedFields && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 pt-3 border-t border-border/30">
          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <Input
              type="text"
              value={description}
              onChange={(e) => updateField("description", e.target.value)}
              className="h-8 text-sm"
              placeholder="Enter description..."
            />
          </div>

          {/* Action By */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Action By</label>
            <Input
              type="text"
              value={actionBy}
              onChange={(e) => updateField("actionBy", e.target.value)}
              className="h-8 text-sm"
              placeholder="Person name..."
            />
          </div>

          {/* Completion Date */}
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground">Completion Date</label>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-8 justify-start text-left font-normal text-sm",
                    !completionDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                  {completionDate ? format(new Date(completionDate), "MMM dd, yyyy") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={completionDate ? new Date(completionDate) : undefined}
                  onSelect={(date) => {
                    updateField("completionDate", date ? format(date, "yyyy-MM-dd") : null);
                    setDateOpen(false);
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}

      {/* Add Note Section */}
      {onNoteChange && (
        <div className="mt-2 pt-2 border-t border-border/30">
          {noteOpen || note ? (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <StickyNote className="h-3 w-3" />
                  Note
                </label>
                {!note && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2 text-xs text-muted-foreground"
                    onClick={() => setNoteOpen(false)}
                  >
                    Cancel
                  </Button>
                )}
              </div>
              <Textarea
                value={note}
                onChange={(e) => onNoteChange(e.target.value)}
                className="min-h-[60px] resize-none text-sm"
                placeholder="Add a note..."
              />
            </div>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground gap-1"
              onClick={() => setNoteOpen(true)}
            >
              <StickyNote className="h-3 w-3" />
              Add Note
              <ChevronDown className="h-3 w-3" />
            </Button>
          )}
        </div>
      )}

    </div>
  );
}
