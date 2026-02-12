// Store for persisting form template customizations per building
import { ChecklistItem as ChecklistItemType, ChecklistItemType as ItemType } from "@/lib/formTemplates";

export interface CustomItemData {
  id: string;
  label: string;
  type: ItemType;
  required: boolean;
  unit?: string;
  toggleType?: "on-off" | "open-closed";
  identifierLabel?: string;
  selectOptions?: string[];
}

export interface TemplateCustomization {
  customItems: Record<string, CustomItemData[]>; // sectionId -> items
  removedItems: Record<string, string[]>; // sectionId -> itemIds
  lastUpdated: string;
}

// Get storage key for building + form combination
function getStorageKey(buildingId: string, formId: string): string {
  return `upkeeply_template_${buildingId}_${formId}`;
}

// Get current building ID from session
export function getCurrentBuildingId(): string {
  const loginInfo = localStorage.getItem("loginInfo");
  if (loginInfo) {
    try {
      const parsed = JSON.parse(loginInfo);
      return parsed.buildingId || "default";
    } catch {
      return "default";
    }
  }
  return "default";
}

// Load template customization for a building + form
export function loadTemplateCustomization(formId: string): TemplateCustomization | null {
  const buildingId = getCurrentBuildingId();
  const key = getStorageKey(buildingId, formId);
  const stored = localStorage.getItem(key);
  
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
}

// Save template customization for a building + form
export function saveTemplateCustomization(
  formId: string,
  customItems: Record<string, CustomItemData[]>,
  removedItems: Record<string, string[]>
): void {
  const buildingId = getCurrentBuildingId();
  const key = getStorageKey(buildingId, formId);
  
  const customization: TemplateCustomization = {
    customItems,
    removedItems,
    lastUpdated: new Date().toISOString(),
  };
  
  localStorage.setItem(key, JSON.stringify(customization));
}

// Clear template customization for a building + form
export function clearTemplateCustomization(formId: string): void {
  const buildingId = getCurrentBuildingId();
  const key = getStorageKey(buildingId, formId);
  localStorage.removeItem(key);
}

// Convert CustomItemData to ChecklistItem format
export function customDataToChecklistItem(data: CustomItemData): ChecklistItemType {
  return {
    id: data.id,
    label: data.label,
    type: data.type,
    required: data.required,
    unit: data.unit,
    toggleType: data.toggleType,
    identifierLabel: data.identifierLabel,
    selectOptions: data.selectOptions,
  };
}
