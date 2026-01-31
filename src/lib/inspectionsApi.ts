// API service for inspections - syncs to database instead of localStorage
import { supabase } from "@/integrations/supabase/client";

export interface InspectionResponse {
  value: string | boolean | number | { identifier?: string; status?: boolean | null } | null;
  note?: string;
  description?: string;
  actionBy?: string;
  completionDate?: string;
}

export interface CompletedInspection {
  id: string;
  formId: string;
  formName: string;
  completedAt: string;
  status: "completed" | "issues";
  itemsCount: number;
  issuesCount?: number;
  responses?: Record<string, InspectionResponse>;
}

// Get auth token from session
function getAuthToken(): string | null {
  const sessionStr = localStorage.getItem("upkeeply_session");
  if (sessionStr) {
    try {
      const session = JSON.parse(sessionStr);
      return session.token;
    } catch {
      return null;
    }
  }
  return null;
}

// Fetch all inspections for the building
export async function fetchInspections(): Promise<CompletedInspection[]> {
  const token = getAuthToken();
  if (!token) {
    console.warn("No auth token, returning empty inspections");
    return [];
  }

  try {
    const { data, error } = await supabase.functions.invoke("inspections", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (error) {
      console.error("Error fetching inspections:", error);
      return [];
    }

    // Transform snake_case to camelCase
    return (data?.inspections || []).map((i: Record<string, unknown>) => ({
      id: i.id,
      formId: i.form_id,
      formName: i.form_name,
      completedAt: i.completed_at,
      status: i.status,
      itemsCount: i.items_count,
      issuesCount: i.issues_count,
      responses: i.responses,
    }));
  } catch (error) {
    console.error("Failed to fetch inspections:", error);
    return [];
  }
}

// Fetch inspections for a specific date
export async function fetchInspectionsByDate(date: Date): Promise<CompletedInspection[]> {
  const token = getAuthToken();
  if (!token) return [];

  const dateStr = date.toISOString().split("T")[0];

  try {
    const { data, error } = await supabase.functions.invoke(`inspections?date=${dateStr}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (error) {
      console.error("Error fetching inspections by date:", error);
      return [];
    }

    return (data?.inspections || []).map((i: Record<string, unknown>) => ({
      id: i.id,
      formId: i.form_id,
      formName: i.form_name,
      completedAt: i.completed_at,
      status: i.status,
      itemsCount: i.items_count,
      issuesCount: i.issues_count,
      responses: i.responses,
    }));
  } catch (error) {
    console.error("Failed to fetch inspections by date:", error);
    return [];
  }
}

// Create a new inspection
export async function createInspection(inspection: Omit<CompletedInspection, "id">): Promise<CompletedInspection | null> {
  const token = getAuthToken();
  if (!token) {
    console.error("No auth token for creating inspection");
    return null;
  }

  try {
    const { data, error } = await supabase.functions.invoke("inspections", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: {
        formId: inspection.formId,
        formName: inspection.formName,
        completedAt: inspection.completedAt,
        status: inspection.status,
        itemsCount: inspection.itemsCount,
        issuesCount: inspection.issuesCount,
        responses: inspection.responses,
      },
    });

    if (error) {
      console.error("Error creating inspection:", error);
      return null;
    }

    const i = data?.inspection;
    return i ? {
      id: i.id,
      formId: i.form_id,
      formName: i.form_name,
      completedAt: i.completed_at,
      status: i.status,
      itemsCount: i.items_count,
      issuesCount: i.issues_count,
      responses: i.responses,
    } : null;
  } catch (error) {
    console.error("Failed to create inspection:", error);
    return null;
  }
}

// Clear all inspections for the building
export async function clearInspections(): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const { error } = await supabase.functions.invoke("inspections", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (error) {
      console.error("Error clearing inspections:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to clear inspections:", error);
    return false;
  }
}

// Get unique dates that have inspections
export async function getDatesWithInspections(): Promise<Date[]> {
  const inspections = await fetchInspections();
  const dateSet = new Set<string>();
  
  inspections.forEach((i) => {
    dateSet.add(i.completedAt.split("T")[0]);
  });
  
  return Array.from(dateSet).map((d) => new Date(d));
}
