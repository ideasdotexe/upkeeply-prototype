import { 
  Building2, 
  Car, 
  Flame, 
  Droplets, 
  Wrench, 
  TreePine, 
  Dumbbell, 
  AlertTriangle,
  ClipboardCheck
} from "lucide-react";

export type ChecklistItemType = "pass-fail" | "ok-issue" | "text" | "number";

export interface ChecklistItem {
  id: string;
  label: string;
  type: ChecklistItemType;
  category?: string;
  required?: boolean;
}

export interface FormTemplate {
  id: string;
  name: string;
  shortName: string;
  description: string;
  icon: typeof Building2;
  color: string;
  frequency: "daily" | "weekly" | "monthly";
  estimatedTime: string;
  items: ChecklistItem[];
}

export const formTemplates: FormTemplate[] = [
  {
    id: "daily-maintenance",
    name: "Daily Maintenance Inspection",
    shortName: "Daily Maintenance",
    description: "Morning walkthrough covering HVAC, elevators, and common areas",
    icon: ClipboardCheck,
    color: "bg-primary",
    frequency: "daily",
    estimatedTime: "15-20 min",
    items: [
      { id: "hvac-1", label: "HVAC system operational", type: "pass-fail", category: "HVAC", required: true },
      { id: "hvac-2", label: "Temperature reading (°C)", type: "number", category: "HVAC" },
      { id: "hvac-3", label: "Unusual noises or odors", type: "ok-issue", category: "HVAC" },
      { id: "elev-1", label: "Elevator #1 operational", type: "pass-fail", category: "Elevators", required: true },
      { id: "elev-2", label: "Elevator #2 operational", type: "pass-fail", category: "Elevators", required: true },
      { id: "elev-3", label: "Emergency phone working", type: "pass-fail", category: "Elevators" },
      { id: "lobby-1", label: "Lobby cleanliness", type: "ok-issue", category: "Common Areas", required: true },
      { id: "lobby-2", label: "Lighting functional", type: "pass-fail", category: "Common Areas" },
      { id: "lobby-3", label: "Entry doors secure", type: "pass-fail", category: "Common Areas", required: true },
      { id: "hall-1", label: "Hallway lighting", type: "ok-issue", category: "Common Areas" },
      { id: "hall-2", label: "Exit signs illuminated", type: "pass-fail", category: "Common Areas", required: true },
      { id: "mail-1", label: "Mail room condition", type: "ok-issue", category: "Common Areas" },
      { id: "waste-1", label: "Garbage/recycling areas", type: "ok-issue", category: "Waste Management" },
      { id: "waste-2", label: "Compactor operational", type: "pass-fail", category: "Waste Management" },
      { id: "notes", label: "Additional observations", type: "text", category: "Notes" },
    ],
  },
  {
    id: "building-exterior",
    name: "Building Inspection – Exterior",
    shortName: "Exterior",
    description: "Weekly review of facade, roof, landscaping, and signage",
    icon: Building2,
    color: "bg-info",
    frequency: "weekly",
    estimatedTime: "25-35 min",
    items: [
      { id: "facade-1", label: "Facade condition (cracks, damage)", type: "ok-issue", category: "Facade", required: true },
      { id: "facade-2", label: "Windows intact", type: "pass-fail", category: "Facade" },
      { id: "facade-3", label: "Balcony railings secure", type: "pass-fail", category: "Facade", required: true },
      { id: "roof-1", label: "Roof visible damage", type: "ok-issue", category: "Roof" },
      { id: "roof-2", label: "Drains clear of debris", type: "pass-fail", category: "Roof", required: true },
      { id: "roof-3", label: "HVAC units condition", type: "ok-issue", category: "Roof" },
      { id: "ground-1", label: "Sidewalks condition", type: "ok-issue", category: "Grounds" },
      { id: "ground-2", label: "Parking lot surface", type: "ok-issue", category: "Grounds" },
      { id: "ground-3", label: "Exterior lighting", type: "pass-fail", category: "Grounds" },
      { id: "sign-1", label: "Building signage visible", type: "pass-fail", category: "Signage" },
      { id: "sign-2", label: "Address numbers visible", type: "pass-fail", category: "Signage" },
      { id: "notes", label: "Additional observations", type: "text", category: "Notes" },
    ],
  },
  {
    id: "parking-garage",
    name: "Parking & Garage Inspection",
    shortName: "Parking",
    description: "Weekly check of parking structure, lighting, and access systems",
    icon: Car,
    color: "bg-secondary-foreground",
    frequency: "weekly",
    estimatedTime: "20-30 min",
    items: [
      { id: "struct-1", label: "Structural integrity", type: "ok-issue", category: "Structure", required: true },
      { id: "struct-2", label: "Floor/wall cracks", type: "ok-issue", category: "Structure" },
      { id: "light-1", label: "Lighting levels adequate", type: "pass-fail", category: "Lighting", required: true },
      { id: "light-2", label: "Emergency lighting", type: "pass-fail", category: "Lighting", required: true },
      { id: "access-1", label: "Gate/barrier operational", type: "pass-fail", category: "Access", required: true },
      { id: "access-2", label: "Access card system", type: "pass-fail", category: "Access" },
      { id: "safety-1", label: "Fire extinguishers present", type: "pass-fail", category: "Safety", required: true },
      { id: "safety-2", label: "Signage visible", type: "pass-fail", category: "Safety" },
      { id: "clean-1", label: "Oil stains/spills", type: "ok-issue", category: "Cleanliness" },
      { id: "clean-2", label: "General cleanliness", type: "ok-issue", category: "Cleanliness" },
      { id: "notes", label: "Additional observations", type: "text", category: "Notes" },
    ],
  },
  {
    id: "fire-safety",
    name: "Fire & Life Safety Inspection",
    shortName: "Fire Safety",
    description: "Monthly comprehensive fire safety equipment check",
    icon: Flame,
    color: "bg-destructive",
    frequency: "monthly",
    estimatedTime: "30-45 min",
    items: [
      { id: "alarm-1", label: "Fire alarm panel status", type: "pass-fail", category: "Alarm System", required: true },
      { id: "alarm-2", label: "Pull stations accessible", type: "pass-fail", category: "Alarm System", required: true },
      { id: "alarm-3", label: "Smoke detectors functional", type: "pass-fail", category: "Alarm System", required: true },
      { id: "ext-1", label: "Extinguishers charged", type: "pass-fail", category: "Extinguishers", required: true },
      { id: "ext-2", label: "Extinguishers accessible", type: "pass-fail", category: "Extinguishers", required: true },
      { id: "ext-3", label: "Last inspection date current", type: "pass-fail", category: "Extinguishers" },
      { id: "sprink-1", label: "Sprinkler heads unobstructed", type: "pass-fail", category: "Sprinklers", required: true },
      { id: "sprink-2", label: "Sprinkler room access", type: "pass-fail", category: "Sprinklers" },
      { id: "exit-1", label: "Exit signs illuminated", type: "pass-fail", category: "Egress", required: true },
      { id: "exit-2", label: "Exit paths clear", type: "pass-fail", category: "Egress", required: true },
      { id: "exit-3", label: "Stairwell doors functional", type: "pass-fail", category: "Egress", required: true },
      { id: "emerg-1", label: "Emergency lighting", type: "pass-fail", category: "Emergency", required: true },
      { id: "emerg-2", label: "Evacuation plans posted", type: "pass-fail", category: "Emergency" },
      { id: "notes", label: "Additional observations", type: "text", category: "Notes" },
    ],
  },
  {
    id: "plumbing",
    name: "Plumbing & Water Systems",
    shortName: "Plumbing",
    description: "Monthly inspection of water systems, drains, and fixtures",
    icon: Droplets,
    color: "bg-info",
    frequency: "monthly",
    estimatedTime: "25-35 min",
    items: [
      { id: "water-1", label: "Water pressure adequate", type: "pass-fail", category: "Water Supply", required: true },
      { id: "water-2", label: "Hot water temperature (°C)", type: "number", category: "Water Supply" },
      { id: "water-3", label: "No visible leaks", type: "pass-fail", category: "Water Supply", required: true },
      { id: "drain-1", label: "Floor drains clear", type: "pass-fail", category: "Drainage" },
      { id: "drain-2", label: "Sump pumps operational", type: "pass-fail", category: "Drainage", required: true },
      { id: "boiler-1", label: "Boiler room condition", type: "ok-issue", category: "Mechanical" },
      { id: "boiler-2", label: "Pressure gauges normal", type: "pass-fail", category: "Mechanical" },
      { id: "common-1", label: "Common area fixtures", type: "ok-issue", category: "Fixtures" },
      { id: "common-2", label: "Laundry room drains", type: "ok-issue", category: "Fixtures" },
      { id: "notes", label: "Additional observations", type: "text", category: "Notes" },
    ],
  },
  {
    id: "mechanical-hvac",
    name: "Mechanical & HVAC Systems",
    shortName: "Mechanical",
    description: "Monthly check of heating, cooling, and ventilation equipment",
    icon: Wrench,
    color: "bg-warning",
    frequency: "monthly",
    estimatedTime: "30-40 min",
    items: [
      { id: "hvac-1", label: "Heating system operational", type: "pass-fail", category: "Heating", required: true },
      { id: "hvac-2", label: "Boiler/furnace condition", type: "ok-issue", category: "Heating" },
      { id: "hvac-3", label: "Thermostat calibration", type: "ok-issue", category: "Heating" },
      { id: "cool-1", label: "Cooling system operational", type: "pass-fail", category: "Cooling", required: true },
      { id: "cool-2", label: "Condenser units condition", type: "ok-issue", category: "Cooling" },
      { id: "vent-1", label: "Ventilation fans working", type: "pass-fail", category: "Ventilation", required: true },
      { id: "vent-2", label: "Air filters condition", type: "ok-issue", category: "Ventilation" },
      { id: "vent-3", label: "Ductwork visible damage", type: "ok-issue", category: "Ventilation" },
      { id: "elec-1", label: "Electrical panels accessible", type: "pass-fail", category: "Electrical", required: true },
      { id: "elec-2", label: "No unusual sounds/smells", type: "pass-fail", category: "Electrical" },
      { id: "notes", label: "Additional observations", type: "text", category: "Notes" },
    ],
  },
  {
    id: "landscaping",
    name: "Landscaping & Grounds",
    shortName: "Landscaping",
    description: "Weekly assessment of lawns, gardens, and outdoor amenities",
    icon: TreePine,
    color: "bg-success",
    frequency: "weekly",
    estimatedTime: "20-25 min",
    items: [
      { id: "lawn-1", label: "Lawn condition", type: "ok-issue", category: "Lawns" },
      { id: "lawn-2", label: "Irrigation system", type: "pass-fail", category: "Lawns" },
      { id: "plant-1", label: "Shrubs/hedges trimmed", type: "ok-issue", category: "Plants" },
      { id: "plant-2", label: "Flower beds maintained", type: "ok-issue", category: "Plants" },
      { id: "tree-1", label: "Trees healthy/trimmed", type: "ok-issue", category: "Trees" },
      { id: "tree-2", label: "No hazardous branches", type: "pass-fail", category: "Trees", required: true },
      { id: "path-1", label: "Walkways clear", type: "pass-fail", category: "Pathways", required: true },
      { id: "path-2", label: "Outdoor lighting", type: "pass-fail", category: "Pathways" },
      { id: "furn-1", label: "Outdoor furniture condition", type: "ok-issue", category: "Amenities" },
      { id: "furn-2", label: "BBQ/grill areas", type: "ok-issue", category: "Amenities" },
      { id: "notes", label: "Additional observations", type: "text", category: "Notes" },
    ],
  },
  {
    id: "recreation",
    name: "Recreation Center Inspection",
    shortName: "Recreation",
    description: "Weekly check of gym, pool, and recreational facilities",
    icon: Dumbbell,
    color: "bg-accent",
    frequency: "weekly",
    estimatedTime: "25-35 min",
    items: [
      { id: "gym-1", label: "Gym equipment functional", type: "ok-issue", category: "Gym", required: true },
      { id: "gym-2", label: "Equipment sanitized", type: "pass-fail", category: "Gym" },
      { id: "gym-3", label: "Mirrors/TV screens", type: "ok-issue", category: "Gym" },
      { id: "pool-1", label: "Pool water clarity", type: "ok-issue", category: "Pool" },
      { id: "pool-2", label: "pH level normal", type: "pass-fail", category: "Pool" },
      { id: "pool-3", label: "Pool deck clean/safe", type: "pass-fail", category: "Pool", required: true },
      { id: "sauna-1", label: "Sauna/steam room", type: "ok-issue", category: "Spa" },
      { id: "change-1", label: "Change room cleanliness", type: "ok-issue", category: "Facilities" },
      { id: "change-2", label: "Showers/lockers", type: "ok-issue", category: "Facilities" },
      { id: "safety-1", label: "First aid kit stocked", type: "pass-fail", category: "Safety", required: true },
      { id: "safety-2", label: "Emergency procedures posted", type: "pass-fail", category: "Safety" },
      { id: "notes", label: "Additional observations", type: "text", category: "Notes" },
    ],
  },
  {
    id: "deficiency-report",
    name: "Deficiency Report",
    shortName: "Deficiency",
    description: "Document and track issues requiring follow-up or contractor work",
    icon: AlertTriangle,
    color: "bg-warning",
    frequency: "daily",
    estimatedTime: "10-15 min",
    items: [
      { id: "location", label: "Location of deficiency", type: "text", category: "Details", required: true },
      { id: "description", label: "Description of issue", type: "text", category: "Details", required: true },
      { id: "severity", label: "Severity level (1-5)", type: "number", category: "Assessment", required: true },
      { id: "safety", label: "Safety hazard present", type: "pass-fail", category: "Assessment", required: true },
      { id: "urgent", label: "Requires immediate attention", type: "pass-fail", category: "Assessment" },
      { id: "contractor", label: "Contractor required", type: "pass-fail", category: "Action" },
      { id: "estimated-cost", label: "Estimated repair cost ($)", type: "number", category: "Action" },
      { id: "timeline", label: "Suggested repair timeline", type: "text", category: "Action" },
      { id: "notes", label: "Additional notes", type: "text", category: "Notes" },
    ],
  },
];

export const getFormTemplate = (id: string): FormTemplate | undefined => {
  return formTemplates.find((template) => template.id === id);
};

export const getFormsByFrequency = (frequency: "daily" | "weekly" | "monthly") => {
  return formTemplates.filter((template) => template.frequency === frequency);
};
