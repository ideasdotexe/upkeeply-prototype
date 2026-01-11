import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Camera, CheckCircle, XCircle, AlertCircle, Minus, Sparkles, Power, PowerOff, Lock, Unlock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChecklistItem as ChecklistItemType } from "@/lib/formTemplates";

interface ChecklistItemProps {
  item: ChecklistItemType;
  value: string | boolean | number | null;
  onChange: (value: string | boolean | number | null) => void;
  note?: string;
  onNoteChange?: (note: string) => void;
  aiSuggestion?: {
    value: string | boolean | number;
    confidence: number;
    reasoning: string;
  };
  onAcceptSuggestion?: () => void;
  onSkipSuggestion?: () => void;
}

export function ChecklistItem({
  item,
  value,
  onChange,
  note,
  onNoteChange,
  aiSuggestion,
  onAcceptSuggestion,
  onSkipSuggestion,
}: ChecklistItemProps) {
  const [showNote, setShowNote] = useState(!!note);
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);

  const renderInput = () => {
    switch (item.type) {
      case "pass-fail":
        return (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={value === true ? "default" : "outline"}
              className={cn(
                "gap-1.5 transition-all",
                value === true && "bg-success hover:bg-success/90 text-success-foreground"
              )}
              onClick={() => onChange(value === true ? null : true)}
            >
              <CheckCircle className="h-4 w-4" />
              Pass
            </Button>
            <Button
              type="button"
              size="sm"
              variant={value === false ? "default" : "outline"}
              className={cn(
                "gap-1.5 transition-all",
                value === false && "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              )}
              onClick={() => onChange(value === false ? null : false)}
            >
              <XCircle className="h-4 w-4" />
              Fail
            </Button>
          </div>
        );

      case "ok-issue":
        return (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={value === true ? "default" : "outline"}
              className={cn(
                "gap-1.5 transition-all",
                value === true && "bg-success hover:bg-success/90 text-success-foreground"
              )}
              onClick={() => onChange(value === true ? null : true)}
            >
              <CheckCircle className="h-4 w-4" />
              OK
            </Button>
            <Button
              type="button"
              size="sm"
              variant={value === false ? "default" : "outline"}
              className={cn(
                "gap-1.5 transition-all",
                value === false && "bg-warning hover:bg-warning/90 text-warning-foreground"
              )}
              onClick={() => onChange(value === false ? null : false)}
            >
              <AlertCircle className="h-4 w-4" />
              Issue
            </Button>
          </div>
        );

      case "on-off":
        return (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={value === true ? "default" : "outline"}
              className={cn(
                "gap-1.5 transition-all",
                value === true && "bg-success hover:bg-success/90 text-success-foreground"
              )}
              onClick={() => onChange(value === true ? null : true)}
            >
              <Power className="h-4 w-4" />
              ON
            </Button>
            <Button
              type="button"
              size="sm"
              variant={value === false ? "default" : "outline"}
              className={cn(
                "gap-1.5 transition-all",
                value === false && "bg-muted hover:bg-muted/90 text-muted-foreground"
              )}
              onClick={() => onChange(value === false ? null : false)}
            >
              <PowerOff className="h-4 w-4" />
              OFF
            </Button>
          </div>
        );

      case "open-closed":
        return (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={value === true ? "default" : "outline"}
              className={cn(
                "gap-1.5 transition-all",
                value === true && "bg-success hover:bg-success/90 text-success-foreground"
              )}
              onClick={() => onChange(value === true ? null : true)}
            >
              <Unlock className="h-4 w-4" />
              OPEN
            </Button>
            <Button
              type="button"
              size="sm"
              variant={value === false ? "default" : "outline"}
              className={cn(
                "gap-1.5 transition-all",
                value === false && "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              )}
              onClick={() => onChange(value === false ? null : false)}
            >
              <Lock className="h-4 w-4" />
              CLOSED
            </Button>
          </div>
        );

      case "number":
        return (
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={value as number ?? ""}
              onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
              className="w-32"
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
            className="max-w-md"
            placeholder={item.placeholder || "Enter details..."}
          />
        );

      case "textarea":
        return (
          <Textarea
            value={value as string ?? ""}
            onChange={(e) => onChange(e.target.value || null)}
            className="min-h-[100px] resize-none"
            placeholder={item.placeholder || "Enter details..."}
          />
        );

      default:
        return null;
    }
  };

  const hasIssue = value === false && (item.type === "pass-fail" || item.type === "ok-issue" || item.type === "open-closed");

  return (
    <div className={cn(
      "rounded-lg border p-4 transition-all",
      hasIssue ? "border-warning/50 bg-warning/5" : "border-border/50 bg-card",
      aiSuggestion && "ring-2 ring-accent/30"
    )}>
      {/* AI Suggestion Banner */}
      {aiSuggestion && (
        <div className="flex items-center justify-between gap-3 mb-3 pb-3 border-b border-accent/20">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">AI Suggestion</span>
            <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20">
              {Math.round(aiSuggestion.confidence * 100)}% confident
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-xs h-7"
              onClick={onSkipSuggestion}
            >
              Skip
            </Button>
            <Button
              type="button"
              size="sm"
              className="text-xs h-7 bg-accent text-accent-foreground hover:bg-accent/90"
              onClick={onAcceptSuggestion}
            >
              Accept
            </Button>
          </div>
        </div>
      )}

      {/* Item Header */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-foreground">{item.label}</span>
            {item.required && (
              <span className="text-destructive text-sm">*</span>
            )}
          </div>
          {aiSuggestion && (
            <p className="text-xs text-muted-foreground mt-1 italic">
              {aiSuggestion.reasoning}
            </p>
          )}
        </div>
        {item.category && (
          <Badge variant="secondary" className="text-xs shrink-0">
            {item.category}
          </Badge>
        )}
      </div>

      {/* Input */}
      <div className="mb-3">
        {renderInput()}
      </div>

      {/* Actions - hide for textarea type since it already handles text input */}
      {item.type !== "textarea" && (
        <div className="flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={() => setShowNote(!showNote)}
          >
            <Minus className="h-3 w-3 rotate-90" />
            {showNote ? "Hide" : "Add"} Note
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="text-xs h-8 gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPhotoUpload(!showPhotoUpload)}
          >
            <Camera className="h-3 w-3" />
            Photo
          </Button>
        </div>
      )}

      {/* Note Field */}
      {showNote && item.type !== "textarea" && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <Textarea
            value={note || ""}
            onChange={(e) => onNoteChange?.(e.target.value)}
            className="min-h-[60px] resize-none text-sm"
            placeholder="Add a note about this item..."
          />
        </div>
      )}

      {/* Photo Upload Placeholder */}
      {showPhotoUpload && (
        <div className="mt-3 pt-3 border-t border-border/50">
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              PNG, JPG up to 5MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
