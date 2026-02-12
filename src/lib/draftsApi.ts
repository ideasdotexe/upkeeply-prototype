// API service for form drafts - syncs to database
import { supabase } from "@/integrations/supabase/client";

export interface DraftData {
  formId: string;
  responses: Record<string, unknown>;
  customSections?: unknown[];
  removedItems?: Record<string, string[]>;
}

export interface SavedDraft {
  id: string;
  formId: string;
  responses: Record<string, unknown>;
  customSections: unknown[];
  removedItems: Record<string, string[]>;
  updatedAt: string;
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

// Fetch draft for a specific form
export async function fetchDraft(formId: string): Promise<SavedDraft | null> {
  const token = getAuthToken();
  if (!token) {
    console.warn("No auth token, cannot fetch draft");
    return null;
  }

  try {
    const { data, error } = await supabase.functions.invoke(`drafts?formId=${formId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (error) {
      console.error("Error fetching draft:", error);
      return null;
    }

    const draft = data?.draft;
    if (!draft) return null;

    return {
      id: draft.id,
      formId: draft.form_id,
      responses: draft.responses || {},
      customSections: draft.custom_sections || [],
      removedItems: draft.removed_items || {},
      updatedAt: draft.updated_at,
    };
  } catch (error) {
    console.error("Failed to fetch draft:", error);
    return null;
  }
}

// Save draft to database
export async function saveDraft(draft: DraftData): Promise<boolean> {
  const token = getAuthToken();
  if (!token) {
    console.error("No auth token for saving draft");
    return false;
  }

  try {
    const { data, error } = await supabase.functions.invoke("drafts", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: {
        formId: draft.formId,
        responses: draft.responses,
        customSections: draft.customSections || [],
        removedItems: draft.removedItems || {},
      },
    });

    if (error) {
      console.error("Error saving draft:", error);
      return false;
    }

    return data?.success === true;
  } catch (error) {
    console.error("Failed to save draft:", error);
    return false;
  }
}

// Delete draft after submission
export async function deleteDraft(formId: string): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const { error } = await supabase.functions.invoke(`drafts?formId=${formId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (error) {
      console.error("Error deleting draft:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to delete draft:", error);
    return false;
  }
}
