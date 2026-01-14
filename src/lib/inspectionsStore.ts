// Mock inspections store for calendar data
export interface CompletedInspection {
  id: string;
  formId: string;
  formName: string;
  completedAt: string;
  status: "completed" | "issues";
  itemsCount: number;
  issuesCount?: number;
}

// Initial mock data
const initialInspections: CompletedInspection[] = [
  {
    id: "insp-1",
    formId: "daily-maintenance",
    formName: "Daily Maintenance",
    completedAt: "2026-01-14T08:30:00Z",
    status: "completed",
    itemsCount: 15,
  },
  {
    id: "insp-2",
    formId: "fire-life-safety",
    formName: "Fire & Life Safety",
    completedAt: "2026-01-13T10:00:00Z",
    status: "issues",
    itemsCount: 14,
    issuesCount: 2,
  },
  {
    id: "insp-3",
    formId: "parking-garage",
    formName: "Parking Garage Inspection",
    completedAt: "2026-01-12T14:00:00Z",
    status: "completed",
    itemsCount: 11,
  },
  {
    id: "insp-4",
    formId: "daily-maintenance",
    formName: "Daily Maintenance",
    completedAt: "2026-01-12T08:45:00Z",
    status: "completed",
    itemsCount: 15,
  },
  {
    id: "insp-5",
    formId: "landscaping",
    formName: "Landscaping & Grounds",
    completedAt: "2026-01-11T09:30:00Z",
    status: "completed",
    itemsCount: 12,
  },
  {
    id: "insp-6",
    formId: "daily-maintenance",
    formName: "Daily Maintenance",
    completedAt: "2026-01-11T08:30:00Z",
    status: "completed",
    itemsCount: 15,
  },
  {
    id: "insp-7",
    formId: "pool-recreation",
    formName: "Pool & Recreation Center",
    completedAt: "2026-01-10T11:00:00Z",
    status: "issues",
    itemsCount: 10,
    issuesCount: 1,
  },
  {
    id: "insp-8",
    formId: "daily-maintenance",
    formName: "Daily Maintenance",
    completedAt: "2026-01-10T08:30:00Z",
    status: "completed",
    itemsCount: 15,
  },
  {
    id: "insp-9",
    formId: "mechanical-systems",
    formName: "Mechanical Systems Inspection",
    completedAt: "2026-01-09T10:00:00Z",
    status: "completed",
    itemsCount: 8,
  },
  {
    id: "insp-10",
    formId: "daily-maintenance",
    formName: "Daily Maintenance",
    completedAt: "2026-01-09T08:30:00Z",
    status: "completed",
    itemsCount: 15,
  },
  {
    id: "insp-11",
    formId: "gym-fitness",
    formName: "Gym & Fitness Inspection",
    completedAt: "2026-01-08T14:00:00Z",
    status: "completed",
    itemsCount: 12,
  },
  {
    id: "insp-12",
    formId: "daily-maintenance",
    formName: "Daily Maintenance",
    completedAt: "2026-01-08T08:30:00Z",
    status: "completed",
    itemsCount: 15,
  },
];

export function getInspections(): CompletedInspection[] {
  // Clear old cache and use fresh data to ensure form IDs match templates
  const stored = localStorage.getItem("upkeeply_inspections");
  if (stored) {
    const parsed = JSON.parse(stored);
    // Check if stored data has old invalid form IDs - if so, reset to initial data
    const hasInvalidFormIds = parsed.some((i: CompletedInspection) => 
      ["fire-safety", "exterior", "pool-spa", "elevator", "hvac"].includes(i.formId)
    );
    if (hasInvalidFormIds) {
      localStorage.setItem("upkeeply_inspections", JSON.stringify(initialInspections));
      return initialInspections;
    }
    return parsed;
  }
  localStorage.setItem("upkeeply_inspections", JSON.stringify(initialInspections));
  return initialInspections;
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