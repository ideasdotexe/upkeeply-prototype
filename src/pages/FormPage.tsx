import { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { ChecklistItem } from "@/components/ChecklistItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  Download, 
  Save, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Building2,
  Plus,
  ChevronDown
} from "lucide-react";
import { getFormTemplate, FormSection, ChecklistItem as ChecklistItemType, ChecklistItemType as ItemType } from "@/lib/formTemplates";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FormResponse {
  [itemId: string]: {
    value: string | boolean | number | { identifier?: string; status?: boolean | null } | null;
    note?: string;
  };
}

interface CustomItem extends ChecklistItemType {
  isCustom?: boolean;
}

interface CustomSection extends FormSection {
  items: CustomItem[];
}

export default function FormPage() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const template = getFormTemplate(formId || "");

  const [responses, setResponses] = useState<FormResponse>({});
  const [isSaving, setIsSaving] = useState(false);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  
  // Add item dialog state
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemType, setNewItemType] = useState<ItemType>("ok-issue");
  const [newItemSection, setNewItemSection] = useState("");

  // Merge template sections with custom sections
  const allSections = useMemo(() => {
    if (!template) return [];
    
    const templateSections = template.sections.length > 0 
      ? template.sections 
      : [{ id: "general", title: "General", items: template.items }];
    
    // Merge custom items into existing sections or add new sections
    const merged: CustomSection[] = templateSections.map(section => ({
      ...section,
      items: section.items.map(item => ({ ...item, isCustom: false })),
    }));
    
    customSections.forEach(customSection => {
      const existingIndex = merged.findIndex(s => s.id === customSection.id);
      if (existingIndex >= 0) {
        merged[existingIndex].items.push(...customSection.items);
      } else {
        merged.push(customSection);
      }
    });
    
    return merged;
  }, [template, customSections]);

  // Get all items for counting
  const allItems = useMemo(() => {
    return allSections.flatMap(s => s.items);
  }, [allSections]);

  // Calculate progress
  const requiredItems = allItems.filter((item) => item.required);
  const completedRequired = requiredItems.filter((item) => {
    const response = responses[item.id]?.value;
    if (item.type === "combined-toggle") {
      const combined = response as { identifier?: string; status?: boolean | null };
      return combined?.status !== undefined && combined?.status !== null;
    }
    return response !== undefined && response !== null;
  });
  const progress = requiredItems.length > 0 
    ? Math.round((completedRequired.length / requiredItems.length) * 100)
    : 0;

  // Count issues
  const issuesCount = Object.entries(responses).filter(([_, r]) => {
    if (typeof r.value === "object" && r.value !== null && "status" in r.value) {
      return r.value.status === false;
    }
    return r.value === false;
  }).length;

  const handleValueChange = useCallback((itemId: string, value: FormResponse[string]["value"]) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        value,
      },
    }));
  }, []);

  const handleNoteChange = useCallback((itemId: string, note: string) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        note,
      },
    }));
  }, []);

  const handleRemoveItem = useCallback((sectionId: string, itemId: string) => {
    setCustomSections(prev => 
      prev.map(section => {
        if (section.id === sectionId) {
          return {
            ...section,
            items: section.items.filter(item => item.id !== itemId),
          };
        }
        return section;
      }).filter(section => section.items.length > 0)
    );
    
    // Remove response for this item
    setResponses(prev => {
      const newResponses = { ...prev };
      delete newResponses[itemId];
      return newResponses;
    });
    
    toast.success("Item removed");
  }, []);

  const handleAddItem = useCallback(() => {
    if (!newItemLabel.trim() || !newItemSection) {
      toast.error("Please fill in all fields");
      return;
    }

    const newItem: CustomItem = {
      id: `custom-${Date.now()}`,
      label: newItemLabel.trim(),
      type: newItemType,
      required: false,
      isCustom: true,
    };

    setCustomSections(prev => {
      const existingSection = prev.find(s => s.id === newItemSection);
      if (existingSection) {
        return prev.map(s => 
          s.id === newItemSection 
            ? { ...s, items: [...s.items, newItem] }
            : s
        );
      }
      
      // Find section title from template
      const templateSection = allSections.find(s => s.id === newItemSection);
      return [...prev, {
        id: newItemSection,
        title: templateSection?.title || newItemSection,
        items: [newItem],
      }];
    });

    setNewItemLabel("");
    setNewItemType("ok-issue");
    setNewItemSection("");
    setAddItemDialogOpen(false);
    toast.success("Item added");
  }, [newItemLabel, newItemType, newItemSection, allSections]);

  const handleSaveDraft = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success("Draft saved successfully");
  };

  const handleDownloadPDF = () => {
    toast.info("PDF generation will be available once Cloud is enabled");
  };

  const handleSubmit = async () => {
    const incompleteRequired = requiredItems.filter((item) => {
      const response = responses[item.id]?.value;
      if (item.type === "combined-toggle") {
        const combined = response as { identifier?: string; status?: boolean | null };
        return combined?.status === undefined || combined?.status === null;
      }
      return response === undefined || response === null;
    });

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
                  <span>{allItems.length} items</span>
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
          <div className="lg:col-span-3 space-y-4">
            {/* Add Item Button */}
            <div className="flex justify-end">
              <Dialog open={addItemDialogOpen} onOpenChange={setAddItemDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Custom Item</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Section</label>
                      <Select value={newItemSection} onValueChange={setNewItemSection}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          {allSections.map(section => (
                            <SelectItem key={section.id} value={section.id}>
                              {section.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Item Label</label>
                      <Input
                        value={newItemLabel}
                        onChange={(e) => setNewItemLabel(e.target.value)}
                        placeholder="e.g., Check water pressure"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Type</label>
                      <Select value={newItemType} onValueChange={(v) => setNewItemType(v as ItemType)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ok-issue">OK / Issue</SelectItem>
                          <SelectItem value="pass-fail">Pass / Fail</SelectItem>
                          <SelectItem value="on-off">ON / OFF</SelectItem>
                          <SelectItem value="open-closed">OPEN / CLOSED</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="text">Text</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAddItem}>Add Item</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {/* Sections as Accordion */}
            <Accordion 
              type="multiple" 
              value={expandedSections}
              onValueChange={setExpandedSections}
              className="space-y-3"
            >
              {allSections.map((section) => {
                const sectionItems = section.items;
                const sectionRequired = sectionItems.filter(i => i.required);
                const sectionCompleted = sectionRequired.filter(item => {
                  const response = responses[item.id]?.value;
                  if (item.type === "combined-toggle") {
                    const combined = response as { identifier?: string; status?: boolean | null };
                    return combined?.status !== undefined && combined?.status !== null;
                  }
                  return response !== undefined && response !== null;
                });
                const sectionProgress = sectionRequired.length > 0
                  ? Math.round((sectionCompleted.length / sectionRequired.length) * 100)
                  : 100;

                return (
                  <AccordionItem 
                    key={section.id} 
                    value={section.id}
                    className="border rounded-lg bg-card overflow-hidden"
                  >
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50 [&[data-state=open]>div>.chevron]:rotate-180">
                      <div className="flex items-center justify-between flex-1 pr-2">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-foreground">{section.title}</span>
                          <Badge variant="secondary" className="text-xs">
                            {sectionItems.length}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3">
                          {sectionProgress < 100 && (
                            <div className="flex items-center gap-2">
                              <Progress value={sectionProgress} className="w-16 h-1.5" />
                              <span className="text-xs text-muted-foreground">{sectionProgress}%</span>
                            </div>
                          )}
                          {sectionProgress === 100 && sectionRequired.length > 0 && (
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          )}
                          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 chevron" />
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-2 pt-2">
                        {sectionItems.map((item) => (
                          <ChecklistItem
                            key={item.id}
                            item={item}
                            value={responses[item.id]?.value ?? null}
                            onChange={(value) => handleValueChange(item.id, value)}
                            note={responses[item.id]?.note}
                            onNoteChange={(note) => handleNoteChange(item.id, note)}
                            canRemove={item.isCustom}
                            onRemove={() => handleRemoveItem(section.id, item.id)}
                          />
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
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
