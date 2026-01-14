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

// Initial mock data
const initialIssues: Issue[] = [
  {
    id: "1",
    title: "Fire extinguisher expired",
    description: "Fire extinguisher on floor 3 hallway has expired and needs replacement",
    location: "Floor 3, Hallway B",
    priority: "high",
    status: "open",
    formName: "Fire Safety Inspection",
    openedAt: "2026-01-10T09:30:00Z",
  },
  {
    id: "2",
    title: "Parking garage light out",
    description: "Light fixture in parking level P2, section C is not working",
    location: "Parking P2, Section C",
    priority: "medium",
    status: "open",
    formName: "Parking Garage Inspection",
    openedAt: "2026-01-09T14:15:00Z",
  },
  {
    id: "3",
    title: "Pool chemical levels low",
    description: "Chlorine levels below acceptable range, requires adjustment",
    location: "Pool Area",
    priority: "high",
    status: "open",
    formName: "Pool & Spa Safety",
    openedAt: "2026-01-11T08:00:00Z",
  },
  {
    id: "4",
    title: "Elevator door sensor malfunction",
    description: "Elevator B door sensor occasionally fails to detect obstructions",
    location: "Elevator B, All Floors",
    priority: "high",
    status: "resolved",
    formName: "Elevator Inspection",
    openedAt: "2026-01-05T10:00:00Z",
    closedAt: "2026-01-08T16:30:00Z",
  },
  {
    id: "5",
    title: "Lobby floor tile cracked",
    description: "Single floor tile near entrance has a visible crack",
    location: "Main Lobby",
    priority: "low",
    status: "resolved",
    formName: "Daily Maintenance",
    openedAt: "2026-01-03T11:00:00Z",
    closedAt: "2026-01-06T09:00:00Z",
  },
];

// Get stored issues from localStorage or use initial data
export function getIssues(): Issue[] {
  const stored = localStorage.getItem("upkeeply_issues");
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with mock data
  localStorage.setItem("upkeeply_issues", JSON.stringify(initialIssues));
  return initialIssues;
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