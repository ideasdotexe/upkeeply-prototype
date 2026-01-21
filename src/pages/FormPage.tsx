import { useState, useMemo, useCallback, useEffect } from "react";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  ArrowLeft, 
  Save, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Building2,
  Plus,
  Check,
  ChevronsUpDown,
  RotateCcw
} from "lucide-react";
import { getFormTemplate, FormSection, ChecklistItem as ChecklistItemType, ChecklistItemType as ItemType, itemTemplateLibrary, ItemTemplate, MechanicalMaintenanceValue } from "@/lib/formTemplates";
import { addIssue } from "@/lib/issuesStore";
import { loadTemplateCustomization, saveTemplateCustomization, clearTemplateCustomization, CustomItemData, customDataToChecklistItem } from "@/lib/formTemplateStore";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ExtendedValue {
  mainValue?: string | boolean | number | { identifier?: string; status?: boolean | null } | MechanicalMaintenanceValue | null;
  actionBy?: string;
  completionDate?: string;
}

interface FormResponse {
  [itemId: string]: {
    value: ExtendedValue | null;
    note?: string;
  };
}

interface CustomItem extends ChecklistItemType {
  isCustom?: boolean;
}

interface CustomSection extends FormSection {
  items: CustomItem[];
}

// Track removed template items
interface RemovedItems {
  [sectionId: string]: Set<string>;
}

export default function FormPage() {
  const { formId } = useParams<{ formId: string }>();
  const navigate = useNavigate();
  const template = getFormTemplate(formId || "");

  const [responses, setResponses] = useState<FormResponse>({});
  const [isSaving, setIsSaving] = useState(false);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [removedItems, setRemovedItems] = useState<RemovedItems>({});
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [templateLoaded, setTemplateLoaded] = useState(false);
  const [loggedInUserName, setLoggedInUserName] = useState("");
  
  // Add item dialog state
  const [addItemDialogOpen, setAddItemDialogOpen] = useState(false);
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemType, setNewItemType] = useState<ItemType>("ok-issue");
  const [newItemSection, setNewItemSection] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("");
  const [templateSearchOpen, setTemplateSearchOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ItemTemplate | null>(null);
  
  // Delete confirmation dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ sectionId: string; itemId: string; isCustom: boolean; label: string } | null>(null);
  
  // Reset template confirmation dialog state
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // Load logged-in user's name from localStorage
  useEffect(() => {
    const loginInfo = localStorage.getItem("loginInfo");
    if (loginInfo) {
      try {
        const parsed = JSON.parse(loginInfo);
        setLoggedInUserName(parsed.fullName || parsed.username || "");
      } catch {
        // Ignore parsing errors
      }
    }
  }, []);

  // Load saved template customization on mount
  useEffect(() => {
    if (!formId || templateLoaded) return;
    
    const saved = loadTemplateCustomization(formId);
    if (saved) {
      // Convert saved custom items to CustomSection format
      const sections: CustomSection[] = [];
      Object.entries(saved.customItems).forEach(([sectionId, items]) => {
        if (items.length > 0) {
          const templateSection = template?.sections.find(s => s.id === sectionId);
          sections.push({
            id: sectionId,
            title: templateSection?.title || sectionId,
            items: items.map(item => ({
              ...customDataToChecklistItem(item),
              isCustom: true,
            })),
          });
        }
      });
      setCustomSections(sections);
      
      // Convert saved removed items to Set format
      const removed: RemovedItems = {};
      Object.entries(saved.removedItems).forEach(([sectionId, itemIds]) => {
        removed[sectionId] = new Set(itemIds);
      });
      setRemovedItems(removed);
    }
    setTemplateLoaded(true);
  }, [formId, template, templateLoaded]);

  // Save template customization whenever custom items or removed items change
  useEffect(() => {
    if (!formId || !templateLoaded) return;
    
    // Convert customSections to storage format
    const customItems: Record<string, CustomItemData[]> = {};
    customSections.forEach(section => {
      customItems[section.id] = section.items.map(item => ({
        id: item.id,
        label: item.label,
        type: item.type,
        required: item.required || false,
        unit: item.unit,
        toggleType: item.toggleType,
        identifierLabel: item.identifierLabel,
        selectOptions: item.selectOptions,
      }));
    });
    
    // Convert removedItems Sets to arrays
    const removedItemsArray: Record<string, string[]> = {};
    Object.entries(removedItems).forEach(([sectionId, itemSet]) => {
      removedItemsArray[sectionId] = Array.from(itemSet);
    });
    
    saveTemplateCustomization(formId, customItems, removedItemsArray);
  }, [formId, customSections, removedItems, templateLoaded]);

  // Merge template sections with custom sections and filter removed items
  const allSections = useMemo(() => {
    if (!template) return [];
    
    const templateSections = template.sections.length > 0 
      ? template.sections 
      : [{ id: "general", title: "General", items: template.items }];
    
    // Merge and filter removed items
    const merged: CustomSection[] = templateSections.map(section => {
      const removedInSection = removedItems[section.id] || new Set();
      return {
        ...section,
        items: section.items
          .filter(item => !removedInSection.has(item.id))
          .map(item => ({ ...item, isCustom: false })),
      };
    });
    
    // Add custom items to their sections
    customSections.forEach(customSection => {
      const existingIndex = merged.findIndex(s => s.id === customSection.id);
      if (existingIndex >= 0) {
        merged[existingIndex].items.push(...customSection.items);
      } else {
        merged.push(customSection);
      }
    });
    
    // Filter out empty sections
    return merged.filter(section => section.items.length > 0);
  }, [template, customSections, removedItems]);

  // Get all items for counting
  const allItems = useMemo(() => {
    return allSections.flatMap(s => s.items);
  }, [allSections]);

  // Calculate progress
  const requiredItems = allItems.filter((item) => item.required);
  const completedRequired = requiredItems.filter((item) => {
    const response = responses[item.id]?.value;
    if (!response) return false;
    const mainValue = response.mainValue;
    if (item.type === "combined-toggle") {
      const combined = mainValue as { identifier?: string; status?: boolean | null };
      return combined?.status !== undefined && combined?.status !== null;
    }
    return mainValue !== undefined && mainValue !== null;
  });
  const progress = requiredItems.length > 0 
    ? Math.round((completedRequired.length / requiredItems.length) * 100)
    : 0;

  // Count issues
  const issuesCount = Object.entries(responses).filter(([_, r]) => {
    if (!r.value) return false;
    const mainValue = r.value.mainValue;
    if (typeof mainValue === "object" && mainValue !== null && "status" in mainValue) {
      return mainValue.status === false;
    }
    return mainValue === false;
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


  // Show delete confirmation dialog
  const handleRemoveItemClick = useCallback((sectionId: string, itemId: string, isCustom: boolean, label: string) => {
    setItemToDelete({ sectionId, itemId, isCustom, label });
    setDeleteDialogOpen(true);
  }, []);

  // Confirm deletion
  const handleConfirmDelete = useCallback(() => {
    if (!itemToDelete) return;
    
    const { sectionId, itemId, isCustom } = itemToDelete;
    
    if (isCustom) {
      // Remove custom item
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
    } else {
      // Mark template item as removed
      setRemovedItems(prev => {
        const sectionRemoved = new Set(prev[sectionId] || []);
        sectionRemoved.add(itemId);
        return { ...prev, [sectionId]: sectionRemoved };
      });
    }
    
    // Remove response for this item
    setResponses(prev => {
      const newResponses = { ...prev };
      delete newResponses[itemId];
      return newResponses;
    });
    
    setDeleteDialogOpen(false);
    setItemToDelete(null);
    toast.success("Item removed");
  }, [itemToDelete]);

  // Reset template to default
  const handleResetTemplate = useCallback(() => {
    if (!formId) return;
    
    clearTemplateCustomization(formId);
    setCustomSections([]);
    setRemovedItems({});
    setResetDialogOpen(false);
    toast.success("Template reset to default");
  }, [formId]);

  // Handle template selection
  const handleTemplateSelect = useCallback((tmpl: ItemTemplate) => {
    setSelectedTemplate(tmpl);
    setNewItemLabel(tmpl.label);
    setNewItemType(tmpl.type);
    setNewItemUnit(tmpl.unit || "");
    setTemplateSearchOpen(false);
  }, []);

  // Handle custom label input
  const handleLabelChange = useCallback((label: string) => {
    setNewItemLabel(label);
    
    // Find matching template for auto-type selection
    const matchingTemplate = itemTemplateLibrary.find(
      t => t.label.toLowerCase() === label.toLowerCase()
    );
    
    if (matchingTemplate) {
      setSelectedTemplate(matchingTemplate);
      setNewItemType(matchingTemplate.type);
      setNewItemUnit(matchingTemplate.unit || "");
    } else {
      setSelectedTemplate(null);
    }
  }, []);

  const handleAddItem = useCallback(() => {
    if (!newItemLabel.trim() || !newItemSection) {
      toast.error("Please fill in all fields");
      return;
    }

    const baseItem: CustomItem = {
      id: `custom-${Date.now()}`,
      label: newItemLabel.trim(),
      type: newItemType,
      required: false,
      isCustom: true,
    };

    // Add properties based on selected template or type
    if (selectedTemplate) {
      if (selectedTemplate.unit) baseItem.unit = selectedTemplate.unit;
      if (selectedTemplate.toggleType) baseItem.toggleType = selectedTemplate.toggleType;
      if (selectedTemplate.identifierLabel) baseItem.identifierLabel = selectedTemplate.identifierLabel;
      if (selectedTemplate.selectOptions) baseItem.selectOptions = selectedTemplate.selectOptions;
    } else if (newItemUnit && newItemType === "number") {
      baseItem.unit = newItemUnit;
    }

    setCustomSections(prev => {
      const existingSection = prev.find(s => s.id === newItemSection);
      if (existingSection) {
        return prev.map(s => 
          s.id === newItemSection 
            ? { ...s, items: [...s.items, baseItem] }
            : s
        );
      }
      
      // Find section title from allSections or template
      const templateSection = template?.sections.find(s => s.id === newItemSection);
      return [...prev, {
        id: newItemSection,
        title: templateSection?.title || newItemSection,
        items: [baseItem],
      }];
    });

    // Reset form
    setNewItemLabel("");
    setNewItemType("ok-issue");
    setNewItemSection("");
    setNewItemUnit("");
    setSelectedTemplate(null);
    setAddItemDialogOpen(false);
    toast.success("Item added");
  }, [newItemLabel, newItemType, newItemSection, newItemUnit, selectedTemplate, template]);

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
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Find items marked as issues
    const issueItems = allItems.filter(item => {
      const response = responses[item.id]?.value;
      if (!response) return false;
      const mainValue = response.mainValue;
      if (item.type === "ok-issue") return mainValue === false;
      if (item.type === "pass-fail") return mainValue === false;
      if (item.type === "mechanical-maintenance") {
        return typeof mainValue === "object" && mainValue !== null && (mainValue as MechanicalMaintenanceValue).issue === true;
      }
      return false;
    });

    // Create issues in the issues store
    issueItems.forEach(item => {
      const raw = responses[item.id]?.value?.mainValue;
      const mechComments =
        item.type === "mechanical-maintenance" && typeof raw === "object" && raw !== null
          ? (raw as MechanicalMaintenanceValue).comments || ""
          : "";
      const note = mechComments || responses[item.id]?.note || "";
      addIssue({
        title: item.label,
        description: note || `Issue found during ${template?.name || "inspection"}`,
        location: "To be specified",
        priority: "medium",
        status: "open",
        formName: template?.name || "",
        openedAt: new Date().toISOString(),
      });
    });

    // Save to inspections store with actual responses
    const newInspection = {
      id: `insp-${Date.now()}`,
      formId: formId || "",
      formName: template?.name || "",
      completedAt: new Date().toISOString(),
      status: issueItems.length > 0 ? "issues" as const : "completed" as const,
      itemsCount: allItems.length,
      issuesCount: issueItems.length > 0 ? issueItems.length : undefined,
      responses: responses,
    };

    // Get existing inspections and add new one
    const stored = localStorage.getItem("upkeeply_inspections");
    const inspections = stored ? JSON.parse(stored) : [];
    inspections.unshift(newInspection);
    localStorage.setItem("upkeeply_inspections", JSON.stringify(inspections));

    setIsSaving(false);
    toast.success("Inspection submitted successfully!");
    navigate("/calendar");
  };

  // Get all possible sections for Add Item dialog
  const allAvailableSections = useMemo(() => {
    if (!template) return [];
    return template.sections.length > 0 
      ? template.sections 
      : [{ id: "general", title: "General", items: [] }];
  }, [template]);

  if (!template) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Form Not Found</h1>
          <p className="text-muted-foreground mb-4">The form you're looking for doesn't exist.</p>
          <Button onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
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
                onClick={() => navigate(-1)}
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
            {/* Template Actions */}
            <div className="flex justify-between items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2 text-muted-foreground hover:text-foreground"
                onClick={() => setResetDialogOpen(true)}
                disabled={customSections.length === 0 && Object.keys(removedItems).length === 0}
              >
                <RotateCcw className="h-4 w-4" />
                Reset to Default
              </Button>
              <Dialog open={addItemDialogOpen} onOpenChange={setAddItemDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Add Item</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Section</label>
                      <Select value={newItemSection} onValueChange={setNewItemSection}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                        <SelectContent>
                          {allAvailableSections.map(section => (
                            <SelectItem key={section.id} value={section.id}>
                              {section.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Item Label</label>
                      <Popover open={templateSearchOpen} onOpenChange={setTemplateSearchOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={templateSearchOpen}
                            className="w-full justify-between font-normal"
                          >
                            {newItemLabel || "Select from library or type custom..."}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0" align="start">
                          <Command>
                            <CommandInput 
                              placeholder="Search templates or type custom..." 
                              value={newItemLabel}
                              onValueChange={handleLabelChange}
                            />
                            <CommandList>
                              <CommandEmpty>
                                <div className="py-2 px-3 text-sm">
                                  No template found. Using "{newItemLabel}" as custom item.
                                </div>
                              </CommandEmpty>
                              <CommandGroup heading="Templates">
                                {itemTemplateLibrary.map((tmpl) => (
                                  <CommandItem
                                    key={tmpl.label}
                                    value={tmpl.label}
                                    onSelect={() => handleTemplateSelect(tmpl)}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedTemplate?.label === tmpl.label
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    <div className="flex items-center gap-2">
                                      <span>{tmpl.label}</span>
                                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                        {tmpl.type}
                                      </Badge>
                                      {tmpl.unit && (
                                        <span className="text-xs text-muted-foreground">({tmpl.unit})</span>
                                      )}
                                    </div>
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {newItemLabel && !selectedTemplate && (
                        <p className="text-xs text-muted-foreground">
                          Custom item - select type below
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Type</label>
                      <Select 
                        value={newItemType} 
                        onValueChange={(v) => setNewItemType(v as ItemType)}
                        disabled={!!selectedTemplate}
                      >
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
                          <SelectItem value="select">Dropdown</SelectItem>
                        </SelectContent>
                      </Select>
                      {selectedTemplate && (
                        <p className="text-xs text-muted-foreground">
                          Type auto-selected from template
                        </p>
                      )}
                    </div>

                    {newItemType === "number" && !selectedTemplate && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Unit (optional)</label>
                        <Input
                          value={newItemUnit}
                          onChange={(e) => setNewItemUnit(e.target.value)}
                          placeholder="e.g., PSI, °C, %"
                        />
                      </div>
                    )}
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
                  if (!response) return false;
                  const mainValue = response.mainValue;
                  if (item.type === "combined-toggle") {
                    const combined = mainValue as { identifier?: string; status?: boolean | null };
                    return combined?.status !== undefined && combined?.status !== null;
                  }
                  return mainValue !== undefined && mainValue !== null;
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
                    <AccordionTrigger className="px-4 py-3 hover:no-underline hover:bg-muted/50">
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
                            note={responses[item.id]?.note ?? ""}
                            onNoteChange={(note) => handleNoteChange(item.id, note)}
                            canRemove={true}
                            onRemove={() => handleRemoveItemClick(section.id, item.id, !!item.isCustom, item.label)}
                            showExtendedFields={template?.hasExtendedFields}
                            loggedInUserName={loggedInUserName}
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove "{itemToDelete?.label}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setItemToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Template Confirmation Dialog */}
      <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset to Default Template</AlertDialogTitle>
            <AlertDialogDescription>
              This will restore all removed items and remove all custom items you've added. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResetTemplate}>Reset Template</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}