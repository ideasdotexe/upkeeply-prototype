// Mock inspections store for calendar data
export interface InspectionResponse {
  value: string | boolean | number | { identifier?: string; status?: boolean | null } | null;
  note?: string;
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

// Initial mock data
const initialInspections: CompletedInspection[] = [];

export function getInspections(): CompletedInspection[] {
  const stored = localStorage.getItem("upkeeply_inspections");
  if (stored) {
    return JSON.parse(stored);
  }
  return initialInspections;
}

export function clearInspections(): void {
  localStorage.removeItem("upkeeply_inspections");
}

export function getInspectionsByDate(date: Date): CompletedInspection[] {
  const inspections = getInspections();
  const dateStr = date.toISOString().split('T')[0];
  return inspections.filter(i => i.completedAt.startsWith(dateStr));
}

export function getDatesWithInspections(): Date[] {
  const inspections = getInspections();
  const dateSet = new Set<string>();
  inspections.forEach(i => {
    dateSet.add(i.completedAt.split('T')[0]);
  });
  return Array.from(dateSet).map(d => new Date(d));
}