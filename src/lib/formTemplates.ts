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

export type ChecklistItemType = 
  | "pass-fail" 
  | "ok-issue" 
  | "on-off" 
  | "open-closed" 
  | "text" 
  | "textarea" 
  | "number"
  | "select"
  | "combined-toggle"; // Combined: number identifier + toggle status in one row

export interface ChecklistItem {
  id: string;
  label: string;
  type: ChecklistItemType;
  category?: string;
  required?: boolean;
  unit?: string;
  placeholder?: string;
  defaultValue?: string | boolean;
  options?: [string, string];
  selectOptions?: string[]; // For select type
  // For combined-toggle type
  toggleType?: "on-off" | "open-closed";
  identifierLabel?: string; // e.g., "Fan #", "Pump #"
}

// Item templates library for quick add
export interface ItemTemplate {
  label: string;
  type: ChecklistItemType;
  unit?: string;
  toggleType?: "on-off" | "open-closed";
  identifierLabel?: string;
  selectOptions?: string[];
}

export const itemTemplateLibrary: ItemTemplate[] = [
  // Toggle items
  { label: "Exhaust Fan", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Fan #" },
  { label: "Supply Fan", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Fan #" },
  { label: "Circulation Pump", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Pump #" },
  { label: "Recirculation Pump", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Pump #" },
  { label: "DCW Booster Pump", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Pump #" },
  { label: "Boiler", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Boiler #" },
  { label: "PRV", type: "combined-toggle", toggleType: "on-off", identifierLabel: "PRV #" },
  { label: "Controller", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Controller #" },
  
  // Simple toggles
  { label: "Exchanger Circulation Pump", type: "on-off" },
  { label: "Glycol Circulation Pump", type: "on-off" },
  { label: "Sprinkler Valves", type: "open-closed" },
  
  // OK/Issue items
  { label: "Residential parking", type: "ok-issue" },
  { label: "Visitors parking", type: "ok-issue" },
  { label: "Building exterior", type: "ok-issue" },
  { label: "Test Sump Pumps (Weekly)", type: "ok-issue" },
  
  // Number items with units
  { label: "Fire Hose Cabinet Pressure", type: "number", unit: "PSI" },
  { label: "Fire Pump Discharge Pressure", type: "number", unit: "PSI" },
  { label: "Controller Air Pressure", type: "number", unit: "PSI" },
  { label: "Discharge Pressure", type: "number", unit: "PSI" },
  { label: "Suction Pressure", type: "number", unit: "PSI" },
  { label: "Differential Air Pressure", type: "number", unit: "PSI" },
  { label: "PRV Air Pressure", type: "number", unit: "PSI" },
  { label: "Bypass PRV Air Pressure", type: "number", unit: "PSI" },
  { label: "Make Up PRV Pressure", type: "number", unit: "PSI" },
  { label: "Air Compressor Tank Air Pressure", type: "number", unit: "PSI" },
  { label: "Inlet Pressure", type: "number", unit: "PSI" },
  { label: "Outlet Pressure", type: "number", unit: "PSI" },
  { label: "Expansion Tank Pressure", type: "number", unit: "PSI" },
  
  // Temperature items
  { label: "Intake Air Temperature", type: "number", unit: "°C" },
  { label: "Supply Air Temperature", type: "number", unit: "°C" },
  { label: "Supply Water Temperature", type: "number", unit: "°C" },
  { label: "Return Water Temperature", type: "number", unit: "°C" },
  { label: "Outdoor Air Temperature", type: "number", unit: "°C" },
  { label: "Design Temperature", type: "number", unit: "°C" },
  { label: "Supply Temperature", type: "number", unit: "°C" },
  { label: "Return Temperature", type: "number", unit: "°C" },
  { label: "Suction Temperature", type: "number", unit: "°C" },
  { label: "Discharge Temperature", type: "number", unit: "°C" },
  { label: "Inlet Temperature", type: "number", unit: "°C" },
  { label: "Outlet Temperature", type: "number", unit: "°C" },
  { label: "Supply Header Temperature", type: "number", unit: "°C" },
  { label: "Return Header Temperature", type: "number", unit: "°C" },
  
  // Other number items
  { label: "Water Meter Reading", type: "number" },
  { label: "Fuel Level", type: "number", unit: "%" },
  { label: "Pressure", type: "number", unit: "PSI" },
  
  // Select items
  { label: "Evaporation Tank Level", type: "select", selectOptions: ["1/4", "2/4", "3/4"] },
  { label: "Expansion Tank Level", type: "select", selectOptions: ["1/4", "2/4", "3/4"] },
];

export interface FormSection {
  id: string;
  title: string;
  items: ChecklistItem[];
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
  sections: FormSection[];
  items: ChecklistItem[]; // Flattened for backward compatibility
  hasExtendedFields?: boolean; // Whether to show Description, Action By, Completion Date fields
  formCode?: string; // Form code like #C-27A-01
}

// Section definitions for Daily Maintenance
const dailyMaintenanceSections: FormSection[] = [
  {
    id: "parking-exterior",
    title: "Parking & Exterior",
    items: [
      { id: "parking-residential", label: "Residential parking – P2, P3, P4 – storage items on parking spots", type: "ok-issue", required: true },
      { id: "parking-visitors", label: "Visitors parking – P1", type: "ok-issue", required: true },
      { id: "building-exterior", label: "Building exterior", type: "ok-issue", required: true },
    ]
  },
  {
    id: "roof-fan-room",
    title: "Roof – Fan Room",
    items: [
      { id: "roof-exhaust-fan-1", label: "Exhaust Fan", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Fan #", placeholder: "Enter #", required: true, defaultValue: true },
      { id: "roof-exhaust-fan-2", label: "Exhaust Fan", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Fan #", placeholder: "Enter #", required: true, defaultValue: true },
      { id: "roof-exhaust-fan-3", label: "Exhaust Fan", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Fan #", placeholder: "Enter #", required: true, defaultValue: true },
      { id: "roof-exhaust-fan-4", label: "Exhaust Fan", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Fan #", placeholder: "Enter #", required: true, defaultValue: true },
    ]
  },
  {
    id: "elevator-mechanical",
    title: "Elevator / Mechanical Room",
    items: [
      { id: "elev-exhaust-fan", label: "Exhaust Fan", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Fan #", required: true, defaultValue: true },
      { id: "elev-evap-tank-1", label: "Evaporation Tank Level", type: "select", selectOptions: ["1/4", "2/4", "3/4"], required: true },
      { id: "elev-evap-tank-2", label: "Evaporation Tank Level", type: "select", selectOptions: ["1/4", "2/4", "3/4"], required: true },
      { id: "elev-fire-hose-pressure", label: "Fire Hose Cabinet Pressure", type: "number", required: true, unit: "PSI" },
    ]
  },
  {
    id: "corridor",
    title: "Corridor",
    items: [
      { id: "corridor-controller-pressure", label: "Controller Air Pressure", type: "number", unit: "PSI", required: true },
      { id: "corridor-supply-fan", label: "Supply Fan", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Fan #", placeholder: "Enter #", required: true },
      { id: "corridor-controller-temp", label: "Controller Air Temperature", type: "number", unit: "°C", required: true },
      { id: "corridor-circ-pump", label: "Circulation Pump", type: "on-off", required: true },
      { id: "corridor-supply-water-temp", label: "Supply Water Temperature", type: "number", unit: "°C", required: true },
      { id: "corridor-return-water-temp", label: "Return Water Temperature", type: "number", unit: "°C", required: true },
      { id: "corridor-outdoor-temp", label: "Outdoor Air Temperature", type: "number", unit: "°C", required: true },
    ]
  },
  {
    id: "ground-floor",
    title: "Ground Floor",
    items: [
      { id: "ground-intake-temp", label: "Intake Air Temperature", type: "number", unit: "°C", required: true },
      { id: "ground-supply-temp", label: "Supply Air Temperature", type: "number", unit: "°C", required: true },
      { id: "ground-controller-pressure", label: "Controller Air Pressure", type: "number", unit: "PSI", required: true },
      { id: "ground-supply-fan", label: "Supply Fan", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Fan #", placeholder: "Enter #", required: true },
      { id: "ground-controller-temp", label: "Controller Air Temperature", type: "number", unit: "°C", required: true },
      { id: "ground-circ-pump", label: "Circulation Pump", type: "on-off", required: true },
      { id: "ground-exhaust-fan-1", label: "Exhaust Fan", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Fan #", placeholder: "Enter #", required: true, defaultValue: true },
      { id: "ground-exhaust-fan-2", label: "Exhaust Fan", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Fan #", placeholder: "Enter #", required: true, defaultValue: true },
    ]
  },
  {
    id: "sprinkler-room",
    title: "Sprinkler Room",
    items: [
      { id: "sprinkler-fire-pump-pressure", label: "Fire Pump Discharge Pressure", type: "number", unit: "PSI", required: true },
      { id: "sprinkler-water-meter", label: "Water Meter Reading", type: "number", required: true },
      { id: "sprinkler-valves", label: "Sprinkler Valves", type: "open-closed", required: true, defaultValue: true },
    ]
  },
  {
    id: "boiler-room-1",
    title: "Boiler Room (1)",
    items: [
      { id: "boiler1-circ-pump-1", label: "Circulation Pump", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Pump #", placeholder: "Enter #", required: true },
      { id: "boiler1-circ-pump-1-suction-temp", label: "Suction Temperature", type: "number", unit: "°C", required: true },
      { id: "boiler1-circ-pump-2", label: "Circulation Pump", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Pump #", placeholder: "Enter #", required: true },
      { id: "boiler1-circ-pump-2-supply-temp", label: "Supply Temperature", type: "number", unit: "°C", required: true },
      { id: "boiler1-circ-pump-2-return-temp", label: "Return Temperature", type: "number", unit: "°C", required: true },
      { id: "boiler1-controller-air-pressure", label: "Controller Air Pressure", type: "number", unit: "PSI", required: true },
      { id: "boiler1-air-compressor-tank-pressure", label: "Air Compressor Tank Air Pressure", type: "number", unit: "PSI", required: true },
      { id: "boiler1-bypass-prv-pressure", label: "Bypass PRV Air Pressure", type: "number", unit: "PSI", required: true },
      { id: "boiler1-prv-1-pressure", label: "PRV Air Pressure", type: "number", unit: "PSI", required: true },
      { id: "boiler1-prv-2-pressure", label: "PRV Air Pressure", type: "number", unit: "PSI", required: true },
      { id: "boiler1-makeup-prv-pressure", label: "Make Up PRV Pressure", type: "number", unit: "PSI", required: true },
      { id: "boiler1-dcw-booster-1", label: "DCW Booster Pump", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Pump #", placeholder: "Enter #", required: true },
      { id: "boiler1-dcw-booster-1-pressure", label: "Discharge Pressure", type: "number", unit: "PSI", required: true },
      { id: "boiler1-dcw-booster-2", label: "DCW Booster Pump", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Pump #", placeholder: "Enter #", required: true },
      { id: "boiler1-dcw-booster-2-pressure", label: "Discharge Pressure", type: "number", unit: "PSI", required: true },
      { id: "boiler1-dcw-booster-3", label: "DCW Booster Pump", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Pump #", placeholder: "Enter #", required: true },
      { id: "boiler1-dcw-booster-3-pressure", label: "Discharge Pressure", type: "number", unit: "PSI", required: true },
      { id: "boiler1-dcw-high-zone-pressure", label: "DCW High Zone Supply Pressure", type: "number", unit: "PSI", required: true },
      { id: "boiler1-dcw-low-zone-pressure", label: "DCW Low Zone Supply Pressure", type: "number", unit: "PSI", required: true },
    ]
  },
  {
    id: "building-heating-high",
    title: "Building Heating High Zone",
    items: [
      { id: "heat-high-design-temp", label: "Design Temperature", type: "number", unit: "°C", required: true },
      { id: "heat-high-supply-temp", label: "Supply Temperature", type: "number", unit: "°C", required: true },
      { id: "heat-high-return-temp", label: "Return Temperature", type: "number", unit: "°C", required: true },
      { id: "heat-high-circ-pump", label: "Circulation Pump", type: "on-off", required: true },
      { id: "heat-high-suction-pressure", label: "Suction Pressure", type: "number", unit: "PSI", required: true },
      { id: "heat-high-discharge-pressure", label: "Discharge Pressure", type: "number", unit: "PSI", required: true },
      { id: "heat-high-controller-pressure", label: "Controller Air Pressure", type: "number", unit: "PSI", required: true },
      { id: "heat-high-diff-pressure", label: "Differential Air Pressure", type: "number", unit: "PSI", required: true },
    ]
  },
  {
    id: "building-heating-low",
    title: "Building Heating Low Zone",
    items: [
      { id: "heat-low-design-temp", label: "Design Temperature", type: "number", unit: "°C", required: true },
      { id: "heat-low-supply-temp", label: "Supply Temperature", type: "number", unit: "°C", required: true },
      { id: "heat-low-return-temp", label: "Return Temperature", type: "number", unit: "°C", required: true },
      { id: "heat-low-circ-pump", label: "Circulation Pump", type: "on-off", required: true },
      { id: "heat-low-suction-pressure", label: "Suction Pressure", type: "number", unit: "PSI", required: true },
      { id: "heat-low-discharge-pressure", label: "Discharge Pressure", type: "number", unit: "PSI", required: true },
      { id: "heat-low-controller-pressure", label: "Controller Air Pressure", type: "number", unit: "PSI", required: true },
      { id: "heat-low-diff-pressure", label: "Differential Air Pressure", type: "number", unit: "PSI", required: true },
    ]
  },
  {
    id: "boiler-room-2",
    title: "Boiler Room (2)",
    items: [
      { id: "boiler2-primary-circ-pump", label: "Primary Circulation Pump", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Pump #", placeholder: "Enter #", required: true },
      { id: "boiler2-primary-discharge-pressure", label: "Discharge Pressure", type: "number", unit: "PSI", required: true },
      { id: "boiler2-primary-discharge-temp", label: "Discharge Temperature", type: "number", unit: "°C", required: true },
    ]
  },
  {
    id: "dhw-low-zone",
    title: "Domestic Hot Water Low Zone",
    items: [
      { id: "dhw-low-exchanger-pump", label: "Exchanger Circulation Pump", type: "on-off", required: true },
      { id: "dhw-low-inlet-temp", label: "Inlet Temperature", type: "number", unit: "°C", required: true },
      { id: "dhw-low-outlet-temp", label: "Outlet Temperature", type: "number", unit: "°C", required: true },
      { id: "dhw-low-recirc-1", label: "Recirculation Pump", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Pump #", placeholder: "Enter #", required: true, defaultValue: true },
      { id: "dhw-low-recirc-2", label: "Recirculation Pump", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Pump #", placeholder: "Enter #", required: true, defaultValue: true },
    ]
  },
  {
    id: "dhw-high-zone",
    title: "Domestic Hot Water High Zone",
    items: [
      { id: "dhw-high-exchanger-pump", label: "Exchanger Circulation Pump", type: "on-off", required: true },
      { id: "dhw-high-inlet-temp", label: "Inlet Temperature", type: "number", unit: "°C", required: true },
      { id: "dhw-high-inlet-pressure", label: "Inlet Pressure", type: "number", unit: "PSI", required: true },
      { id: "dhw-high-outlet-temp", label: "Outlet Temperature", type: "number", unit: "°C", required: true },
      { id: "dhw-high-outlet-pressure", label: "Outlet Pressure", type: "number", unit: "PSI", required: true },
      { id: "dhw-high-recirc-pump", label: "Recirculation Pump", type: "on-off", required: true, defaultValue: true },
    ]
  },
  {
    id: "ramp-heating",
    title: "Ramp Heating System",
    items: [
      { id: "ramp-exchanger-pump", label: "Exchanger Circulation Pump", type: "on-off", required: true },
      { id: "ramp-inlet-temp", label: "Inlet Temperature", type: "number", unit: "°C", required: true },
      { id: "ramp-outlet-temp", label: "Outlet Temperature", type: "number", unit: "°C", required: true },
      { id: "ramp-glycol-pump", label: "Glycol Circulation Pump", type: "on-off", required: true },
      { id: "ramp-supply-temp", label: "Supply Temperature", type: "number", unit: "°C", required: true },
      { id: "ramp-expansion-level", label: "Expansion Tank Level", type: "select", selectOptions: ["1/4", "2/4", "3/4"], required: true },
      { id: "ramp-expansion-pressure", label: "Expansion Tank Pressure", type: "number", unit: "PSI", required: true },
    ]
  },
  {
    id: "boiler-system",
    title: "Boiler System",
    items: [
      { id: "boiler-fuel-level", label: "Fuel Level", type: "number", unit: "%", required: true },
      { id: "boiler-1", label: "Boiler", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Boiler #", placeholder: "Enter #", required: true },
      { id: "boiler-1-pressure", label: "Pressure", type: "number", unit: "PSI", required: true },
      { id: "boiler-2", label: "Boiler", type: "combined-toggle", toggleType: "on-off", identifierLabel: "Boiler #", placeholder: "Enter #", required: true },
      { id: "boiler-2-pressure", label: "Pressure", type: "number", unit: "PSI", required: true },
      { id: "boiler-supply-header-temp", label: "Supply Header Temperature", type: "number", unit: "°C", required: true },
      { id: "boiler-return-header-temp", label: "Return Header Temperature", type: "number", unit: "°C", required: true },
    ]
  },
  {
    id: "miscellaneous",
    title: "Miscellaneous",
    items: [
      { id: "misc-sump-pumps", label: "Test Sump Pumps (Weekly)", type: "ok-issue", required: false },
    ]
  },
  {
    id: "comments",
    title: "Comments",
    items: [
      { id: "comments", label: "", type: "textarea", placeholder: "Enter any additional observations or notes...", required: false },
    ]
  },
];

// Flatten sections to items for backward compatibility
const flattenSections = (sections: FormSection[]): ChecklistItem[] => {
  return sections.flatMap(section => 
    section.items.map(item => ({ ...item, category: section.title }))
  );
};

export const formTemplates: FormTemplate[] = [
  {
    id: "daily-maintenance",
    name: "Daily Inspection",
    shortName: "Daily",
    description: "Comprehensive daily walkthrough covering parking, roof, boiler room, and mechanical systems",
    icon: ClipboardCheck,
    color: "bg-primary",
    frequency: "daily",
    estimatedTime: "25-35 min",
    sections: dailyMaintenanceSections,
    items: flattenSections(dailyMaintenanceSections),
  },
  {
    id: "building-exterior",
    name: "Building Inspection – Exterior",
    shortName: "Exterior",
    description: "Weekly assessment of exterior areas, landscaping, and facilities",
    icon: Building2,
    color: "bg-secondary",
    frequency: "weekly",
    estimatedTime: "30-40 min",
    sections: [],
    hasExtendedFields: true,
    formCode: "#C-27A-01",
    items: [
      { id: "gatehouse", label: "Gatehouse", type: "ok-issue", required: true },
      { id: "visitor-parking", label: "Visitor Parking", type: "ok-issue", required: true },
      { id: "lawns", label: "Lawns", type: "ok-issue", required: true },
      { id: "flower-beds", label: "Flower Beds", type: "ok-issue", required: true },
      { id: "fences-gates", label: "Fences & Gates", type: "ok-issue", required: true },
      { id: "curbs-walkways", label: "Curbs & Walkways", type: "ok-issue", required: true },
      { id: "drivelanes", label: "Drivelanes", type: "ok-issue", required: true },
      { id: "lighting", label: "Lighting", type: "ok-issue", required: true },
      { id: "bbq-area", label: "BBQ Area", type: "ok-issue", required: true },
      { id: "tennis-courts", label: "Tennis Courts", type: "ok-issue", required: true },
      { id: "cabanas", label: "Cabanas", type: "ok-issue", required: true },
      { id: "outdoor-pool", label: "O/D Pool", type: "ok-issue", required: true },
      { id: "playground", label: "Play Ground", type: "ok-issue", required: true },
      { id: "garbage-pickup-areas", label: "Garbage Pick Up Areas", type: "ok-issue", required: true },
      { id: "catch-basins", label: "Catch Basins", type: "ok-issue", required: true },
      { id: "signs", label: "Signs", type: "ok-issue", required: true },
      { id: "other", label: "Other", type: "ok-issue", required: false },
    ],
  },
  {
    id: "parking-garage",
    name: "Building Inspection – Parking Garage",
    shortName: "Parking Garage",
    description: "Weekly inspection of parking garage facilities, safety systems, and infrastructure",
    icon: Car,
    color: "bg-accent",
    frequency: "weekly",
    estimatedTime: "15-20 min",
    sections: [],
    hasExtendedFields: true,
    formCode: "#C-27B-01",
    items: [
      { id: "garage-door", label: "Garage Door", type: "ok-issue", required: true },
      { id: "drive-lanes", label: "Drive Lanes", type: "ok-issue", required: true },
      { id: "lights", label: "Lights", type: "ok-issue", required: true },
      { id: "signs", label: "Signs", type: "ok-issue", required: true },
      { id: "mirrors", label: "Mirrors", type: "ok-issue", required: true },
      { id: "fans", label: "Fans", type: "ok-issue", required: true },
      { id: "drains-catch-basins", label: "Drains / Catch Basins", type: "ok-issue", required: true },
      { id: "heating-ramp", label: "Heating Ramp", type: "ok-issue", required: true },
      { id: "sprinkler-system", label: "Sprinkler System", type: "ok-issue", required: true },
      { id: "firehose", label: "Firehose", type: "ok-issue", required: true },
      { id: "fire-extinguisher", label: "Fire Extinguisher", type: "ok-issue", required: true },
      { id: "elevator", label: "Elevator", type: "ok-issue", required: true },
      { id: "storage-locker-room", label: "Storage / Locker Room", type: "ok-issue", required: true },
      { id: "garbage-room", label: "Garbage Room", type: "ok-issue", required: true },
      { id: "stairwell", label: "Stairwell", type: "ok-issue", required: true },
    ],
  },
  {
    id: "fire-life-safety",
    name: "Fire & Life Safety Inspection",
    shortName: "Fire Safety",
    description: "Monthly fire safety equipment and emergency systems check",
    icon: Flame,
    color: "bg-destructive",
    frequency: "monthly",
    estimatedTime: "45-60 min",
    sections: [],
    items: [
      { id: "fire-extinguishers", label: "Fire extinguishers - accessible and charged", type: "pass-fail", category: "Extinguishers", required: true },
      { id: "fire-alarms", label: "Fire alarm panels - no faults", type: "pass-fail", category: "Alarms", required: true },
      { id: "emergency-lighting", label: "Emergency lighting", type: "pass-fail", category: "Lighting", required: true },
      { id: "exit-signs", label: "Exit signs illuminated", type: "pass-fail", category: "Signage", required: true },
      { id: "sprinkler-system", label: "Sprinkler system valves", type: "open-closed", category: "Sprinklers", required: true },
      { id: "fire-doors", label: "Fire doors - self-closing", type: "pass-fail", category: "Doors", required: true },
    ],
  },
  {
    id: "mechanical-systems",
    name: "Mechanical Systems Inspection",
    shortName: "Mechanical",
    description: "Monthly review of HVAC, plumbing, and electrical systems",
    icon: Wrench,
    color: "bg-warning",
    frequency: "monthly",
    estimatedTime: "40-50 min",
    sections: [],
    items: [
      { id: "hvac-filters", label: "HVAC filters condition", type: "ok-issue", category: "HVAC", required: true },
      { id: "hvac-operation", label: "HVAC operation and temperature", type: "ok-issue", category: "HVAC", required: true },
      { id: "plumbing-leaks", label: "Check for plumbing leaks", type: "ok-issue", category: "Plumbing", required: true },
      { id: "water-heater", label: "Water heater operation", type: "ok-issue", category: "Plumbing", required: true },
      { id: "electrical-panels", label: "Electrical panels - no issues", type: "pass-fail", category: "Electrical", required: true },
    ],
  },
  {
    id: "amenities",
    name: "Building Inspection – Amenities",
    shortName: "Amenities",
    description: "Weekly inspection of amenities, recreation facilities, and guest suites",
    icon: Droplets,
    color: "bg-info",
    frequency: "weekly",
    estimatedTime: "25-30 min",
    hasExtendedFields: true,
    formCode: "#C-27B-01",
    sections: [
      {
        id: "amenities-main",
        title: "Amenities",
        items: [
          { id: "swimming-pool", label: "Swimming Pool", type: "ok-issue", required: true },
          { id: "whirlpool", label: "Whirlpool", type: "ok-issue", required: true },
          { id: "change-rooms", label: "Change Rooms", type: "ok-issue", required: true },
          { id: "showers", label: "Showers", type: "ok-issue", required: true },
          { id: "saunas", label: "Saunas", type: "ok-issue", required: true },
          { id: "exercise-room", label: "Exercise Room", type: "ok-issue", required: true },
          { id: "washrooms", label: "Washrooms", type: "ok-issue", required: true },
          { id: "party-room", label: "Party Room", type: "ok-issue", required: true },
          { id: "card-room", label: "Card Room", type: "ok-issue", required: true },
          { id: "kitchen", label: "Kitchen", type: "ok-issue", required: true },
          { id: "billiard-room", label: "Billiard Room", type: "ok-issue", required: true },
          { id: "squash-courts", label: "Squash Courts", type: "ok-issue", required: true },
          { id: "mechanical-rooms", label: "Mechanical Rooms", type: "ok-issue", required: true },
          { id: "floors", label: "Floors", type: "ok-issue", required: true },
          { id: "furniture", label: "Furniture", type: "ok-issue", required: true },
        ]
      },
      {
        id: "guest-suites",
        title: "Guest Suites",
        items: [
          { id: "guest-hardware", label: "Hardware", type: "ok-issue", required: true },
          { id: "guest-bathroom", label: "Bathroom", type: "ok-issue", required: true },
          { id: "guest-linens", label: "Linens", type: "ok-issue", required: true },
        ]
      },
    ],
    items: [],
  },
  {
    id: "landscaping",
    name: "Landscaping & Grounds",
    shortName: "Landscaping",
    description: "Weekly outdoor areas and landscaping assessment",
    icon: TreePine,
    color: "bg-success",
    frequency: "weekly",
    estimatedTime: "20-25 min",
    sections: [],
    items: [
      { id: "lawn-condition", label: "Lawn condition", type: "ok-issue", category: "Lawn", required: true },
      { id: "irrigation", label: "Irrigation system", type: "ok-issue", category: "Irrigation", required: true },
      { id: "trees-shrubs", label: "Trees and shrubs", type: "ok-issue", category: "Plants", required: true },
      { id: "walkways", label: "Walkways and pathways", type: "ok-issue", category: "Paths", required: true },
    ],
  },
  {
    id: "gym-fitness",
    name: "Gym & Fitness Inspection",
    shortName: "Gym",
    description: "Weekly fitness equipment and facility check",
    icon: Dumbbell,
    color: "bg-primary",
    frequency: "weekly",
    estimatedTime: "15-20 min",
    sections: [],
    items: [
      { id: "cardio-equipment", label: "Cardio machines", type: "ok-issue", category: "Equipment", required: true },
      { id: "weight-equipment", label: "Weight machines and free weights", type: "ok-issue", category: "Equipment", required: true },
      { id: "gym-cleanliness", label: "Gym floor cleanliness", type: "ok-issue", category: "Cleanliness", required: true },
      { id: "gym-ventilation", label: "Ventilation and air quality", type: "ok-issue", category: "Environment", required: true },
    ],
  },
  {
    id: "deficiency-report",
    name: "Deficiency Report",
    shortName: "Deficiency",
    description: "Document and track maintenance issues and repairs needed",
    icon: AlertTriangle,
    color: "bg-warning",
    frequency: "daily",
    estimatedTime: "10-15 min",
    sections: [],
    items: [
      { id: "deficiency-location", label: "Location of issue", type: "text", category: "Details", required: true, placeholder: "e.g., Unit 302, Lobby, Parking P2" },
      { id: "deficiency-description", label: "Description of deficiency", type: "textarea", category: "Details", required: true, placeholder: "Describe the issue in detail..." },
      { id: "deficiency-priority", label: "Priority level assessment", type: "pass-fail", category: "Priority", required: true },
      { id: "deficiency-action", label: "Recommended action", type: "textarea", category: "Action", required: false, placeholder: "What needs to be done to fix this?" },
    ],
  },
];

export const getFormTemplate = (id: string): FormTemplate | undefined => {
  return formTemplates.find((template) => template.id === id);
};

export const getFormsByFrequency = (frequency: "daily" | "weekly" | "monthly" | "all"): FormTemplate[] => {
  if (frequency === "all") return formTemplates;
  return formTemplates.filter((template) => template.frequency === frequency);
};
