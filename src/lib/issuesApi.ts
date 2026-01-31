// API service for issues - syncs to database instead of localStorage
import { supabase } from "@/integrations/supabase/client";

export interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  priority: "low" | "medium" | "high";
  status: "open" | "resolved";
  formName: string;
  openedAt: string;
  closedAt?: string;
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

// Fetch all issues for the building
export async function fetchIssues(): Promise<Issue[]> {
  const token = getAuthToken();
  if (!token) {
    console.warn("No auth token, returning empty issues");
    return [];
  }

  try {
    const { data, error } = await supabase.functions.invoke("issues-api", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (error) {
      console.error("Error fetching issues:", error);
      return [];
    }

    // Transform snake_case to camelCase
    return (data?.issues || []).map((i: Record<string, unknown>) => ({
      id: i.id,
      title: i.title,
      description: i.description,
      location: i.location,
      priority: i.priority,
      status: i.status,
      formName: i.form_name,
      openedAt: i.opened_at,
      closedAt: i.closed_at,
    }));
  } catch (error) {
    console.error("Failed to fetch issues:", error);
    return [];
  }
}

// Create a new issue
export async function createIssue(issue: Omit<Issue, "id" | "openedAt" | "status">): Promise<Issue | null> {
  const token = getAuthToken();
  if (!token) {
    console.error("No auth token for creating issue");
    return null;
  }

  try {
    const { data, error } = await supabase.functions.invoke("issues-api", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: {
        title: issue.title,
        description: issue.description,
        location: issue.location,
        priority: issue.priority,
        formName: issue.formName,
      },
    });

    if (error) {
      console.error("Error creating issue:", error);
      return null;
    }

    const i = data?.issue;
    return i ? {
      id: i.id,
      title: i.title,
      description: i.description,
      location: i.location,
      priority: i.priority,
      status: i.status,
      formName: i.form_name,
      openedAt: i.opened_at,
      closedAt: i.closed_at,
    } : null;
  } catch (error) {
    console.error("Failed to create issue:", error);
    return null;
  }
}

// Resolve an issue
export async function resolveIssue(issueId: string): Promise<Issue | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const { data, error } = await supabase.functions.invoke(`issues-api?id=${issueId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: { status: "resolved" },
    });

    if (error) {
      console.error("Error resolving issue:", error);
      return null;
    }

    const i = data?.issue;
    return i ? {
      id: i.id,
      title: i.title,
      description: i.description,
      location: i.location,
      priority: i.priority,
      status: i.status,
      formName: i.form_name,
      openedAt: i.opened_at,
      closedAt: i.closed_at,
    } : null;
  } catch (error) {
    console.error("Failed to resolve issue:", error);
    return null;
  }
}

// Reopen an issue
export async function reopenIssue(issueId: string): Promise<Issue | null> {
  const token = getAuthToken();
  if (!token) return null;

  try {
    const { data, error } = await supabase.functions.invoke(`issues-api?id=${issueId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: { status: "open" },
    });

    if (error) {
      console.error("Error reopening issue:", error);
      return null;
    }

    const i = data?.issue;
    return i ? {
      id: i.id,
      title: i.title,
      description: i.description,
      location: i.location,
      priority: i.priority,
      status: i.status,
      formName: i.form_name,
      openedAt: i.opened_at,
      closedAt: i.closed_at,
    } : null;
  } catch (error) {
    console.error("Failed to reopen issue:", error);
    return null;
  }
}

// Clear all issues for the building
export async function clearIssues(): Promise<boolean> {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const { error } = await supabase.functions.invoke("issues-api", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (error) {
      console.error("Error clearing issues:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Failed to clear issues:", error);
    return false;
  }
}

// Get count of open issues
export async function getOpenIssuesCount(): Promise<number> {
  const issues = await fetchIssues();
  return issues.filter((i) => i.status === "open").length;
}
