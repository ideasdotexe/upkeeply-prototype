// API service for template customizations - syncs to database instead of localStorage
import { supabase } from "@/integrations/supabase/client";
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

// Get auth token from session
function getAuthToken(): string | null {
  const loginInfo = localStorage.getItem("loginInfo");
  if (loginInfo) {
    try {
      const parsed = JSON.parse(loginInfo);
      return parsed.sessionToken || null;
    } catch {
      return null;
    }
  }
  return null;
}

// Load template customization for a form from database
export async function loadTemplateCustomization(formId: string): Promise<TemplateCustomization | null> {
  const token = getAuthToken();
  if (!token) {
    console.warn("No auth token, returning null customization");
    return null;
  }

  try {
    const { data, error } = await supabase.functions.invoke(`template-customizations?formId=${formId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (error) {
      console.error("Error fetching customization:", error);
      return null;
    }

    const customization = data?.customization;
    if (!customization) return null;

    return {
      customItems: customization.custom_items || {},
      removedItems: customization.removed_items || {},
      lastUpdated: customization.updated_at,
    };
  } catch (error) {
    console.error("Failed to load customization:", error);
    return null;
  }
}

// Save template customization to database
export async function saveTemplateCustomization(
  formId: string,
  customItems: Record<string, CustomItemData[]>,
  removedItems: Record<string, string[]>
): Promise<boolean> {
  const token = getAuthToken();
  if (!token) {
    console.error("No auth token for saving customization");
    return false;
  }

  try {
    const { error } = await supabase.functions.invoke("template-customizations", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: {
        formId,
        customItems,
        removedItems,
      },
    });

    if (error) {
      console.error("Error saving customization:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to save customization:", error);
    return false;
  }
}

// Clear template customization from database
export async function clearTemplateCustomization(formId: string): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const { error } = await supabase.functions.invoke(`template-customizations?formId=${formId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (error) {
      console.error("Error clearing customization:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to clear customization:", error);
    return false;
  }
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
