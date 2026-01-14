// Mock issues store - In production this would be in a database
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

// Initial empty data - issues will be created from form submissions
const initialIssues: Issue[] = [];

// Get stored issues from localStorage or return empty array
export function getIssues(): Issue[] {
  const stored = localStorage.getItem("upkeeply_issues");
  if (stored) {
    return JSON.parse(stored);
  }
  return initialIssues;
}

// Clear all issues
export function clearIssues(): void {
  localStorage.removeItem("upkeeply_issues");
}

// Add a new issue
export function addIssue(issue: Omit<Issue, "id">): Issue[] {
  const issues = getIssues();
  const newIssue: Issue = {
    ...issue,
    id: `issue-${Date.now()}`,
  };
  issues.unshift(newIssue);
  saveIssues(issues);
  return issues;
}

// Save issues to localStorage
export function saveIssues(issues: Issue[]): void {
  localStorage.setItem("upkeeply_issues", JSON.stringify(issues));
}

// Mark an issue as resolved
export function resolveIssue(issueId: string): Issue[] {
  const issues = getIssues();
  const updatedIssues = issues.map(issue => 
    issue.id === issueId 
      ? { ...issue, status: "resolved" as const, closedAt: new Date().toISOString() }
      : issue
  );
  saveIssues(updatedIssues);
  return updatedIssues;
}

// Reopen an issue
export function reopenIssue(issueId: string): Issue[] {
  const issues = getIssues();
  const updatedIssues = issues.map(issue => 
    issue.id === issueId 
      ? { ...issue, status: "open" as const, closedAt: undefined }
      : issue
  );
  saveIssues(updatedIssues);
  return updatedIssues;
}

// Get count of open issues
export function getOpenIssuesCount(): number {
  return getIssues().filter(i => i.status === "open").length;
}