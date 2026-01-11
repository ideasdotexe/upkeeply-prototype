import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { ChecklistItem } from "@/components/ChecklistItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowLeft, 
  Download, 
  Save, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Building2
} from "lucide-react";
import { getFormTemplate } from "@/lib/formTemplates";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FormResponse {
  [itemId: string]: {
    value: string | boolean | number | null;
    note?: string;
  };
}

export default function FormPage() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const template = getFormTemplate(formId || "");

  const [responses, setResponses] = useState<FormResponse>({});
  const [isSaving, setIsSaving] = useState(false);

  if (!template) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Form Not Found</h1>
          <p className="text-muted-foreground mb-4">The form you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/")}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  const Icon = template.icon;

  // Group items by category
  const itemsByCategory = useMemo(() => {
    const groups: { [category: string]: typeof template.items } = {};
    template.items.forEach((item) => {
      const category = item.category || "General";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });
    return groups;
  }, [template.items]);

  // Calculate progress
  const requiredItems = template.items.filter((item) => item.required);
  const completedRequired = requiredItems.filter(
    (item) => responses[item.id]?.value !== undefined && responses[item.id]?.value !== null
  );
  const progress = requiredItems.length > 0 
    ? Math.round((completedRequired.length / requiredItems.length) * 100)
    : 0;

  // Count issues
  const issuesCount = Object.values(responses).filter(
    (r) => r.value === false
  ).length;

  const handleValueChange = (itemId: string, value: string | boolean | number | null) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        value,
      },
    }));
  };

  const handleNoteChange = (itemId: string, note: string) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        note,
      },
    }));
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success("Draft saved successfully");
  };

  const handleDownloadPDF = () => {
    toast.info("PDF generation will be available once Cloud is enabled");
  };

  const handleSubmit = async () => {
    const incompleteRequired = requiredItems.filter(
      (item) => responses[item.id]?.value === undefined || responses[item.id]?.value === null
    );

    if (incompleteRequired.length > 0) {
      toast.error(`Please complete all required items (${incompleteRequired.length} remaining)`);
      return;
    }

    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
    toast.success("Inspection submitted successfully!");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Sticky Progress Bar */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur border-b">
        <div className="container py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
                className="shrink-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center shrink-0", template.color)}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="font-semibold text-foreground truncate">{template.name}</h1>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{template.estimatedTime}</span>
                  <span>·</span>
                  <span>{template.items.length} items</span>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Progress value={progress} className="w-32 h-2" />
                <span className="text-sm font-medium text-muted-foreground">{progress}%</span>
              </div>
              {issuesCount > 0 && (
                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {issuesCount} issue{issuesCount > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </div>

          {/* Mobile Progress */}
          <div className="md:hidden mt-3">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        </div>
      </div>

      <main className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-3 space-y-6">
            {Object.entries(itemsByCategory).map(([category, items]) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-foreground">{category}</h2>
                  <Badge variant="secondary" className="text-xs">
                    {items.length} items
                  </Badge>
                </div>
                <div className="space-y-3">
                  {items.map((item) => (
                    <ChecklistItem
                      key={item.id}
                      item={item}
                      value={responses[item.id]?.value ?? null}
                      onChange={(value) => handleValueChange(item.id, value)}
                      note={responses[item.id]?.note}
                      onNoteChange={(note) => handleNoteChange(item.id, note)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Building Info */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-sm font-medium">Building</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="font-medium text-sm">123 Main Street</p>
                <p className="text-xs text-muted-foreground">Residential · 48 units</p>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Completed</span>
                  <span className="font-medium">{completedRequired.length} / {requiredItems.length}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Issues Found</span>
                  <span className={cn("font-medium", issuesCount > 0 && "text-warning")}>
                    {issuesCount}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className="text-xs">
                    Draft
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-2">
              <Button
                className="w-full gap-2"
                onClick={handleSubmit}
                disabled={isSaving}
              >
                <CheckCircle2 className="h-4 w-4" />
                Submit Inspection
              </Button>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleDownloadPDF}
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
              <Button
                variant="ghost"
                className="w-full gap-2"
                onClick={handleSaveDraft}
                disabled={isSaving}
              >
                <Save className="h-4 w-4" />
                {isSaving ? "Saving..." : "Save Draft"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
