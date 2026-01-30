import {
  Building2,
  Car,
  Flame,
  Droplets,
  Wrench,
  TreePine,
  Dumbbell,
  AlertTriangle,
  ClipboardCheck,
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
  | "combined-toggle" // Combined: number identifier + toggle status in one row
  | "mechanical-maintenance"; // Checkboxes for INSPECT, OIL, CLEAN, TEST, LUBE, FILTER + comments

// Mechanical maintenance value structure
export interface MechanicalMaintenanceValue {
  oil?: boolean;
  clean?: boolean;
  test?: boolean;
  lube?: boolean;
  filter?: boolean;
  issue?: boolean;
  comments?: string;
}

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
  // For mechanical-maintenance type: which action checkboxes should be shown (per PDF asterisks)
  maintenanceActions?: Array<"oil" | "clean" | "test" | "lube" | "filter">;
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
      {
        id: "parking-residential",
        label: "Residential parking – P2, P3, P4 – storage items on parking spots",
        type: "ok-issue",
        required: true,
      },
      { id: "parking-visitors", label: "Visitors parking – P1", type: "ok-issue", required: true },
      { id: "building-exterior", label: "Building exterior", type: "ok-issue", required: true },
    ],
  },
  {
    id: "roof-fan-room",
    title: "Roof – Fan Room",
    items: [
      {
        id: "roof-exhaust-fan-1",
        label: "Exhaust Fan",
        type: "combined-toggle",
        toggleType: "on-off",
        identifierLabel: "Fan #",
        placeholder: "Enter #",
        required: true,
        defaultValue: true,
      },
      {
        id: "roof-exhaust-fan-2",
        label: "Exhaust Fan",
        type: "combined-toggle",
        toggleType: "on-off",
        identifierLabel: "Fan #",
        placeholder: "Enter #",
        required: true,
        defaultValue: true,
      },
      {
        id: "roof-exhaust-fan-3",
        label: "Exhaust Fan",
        type: "combined-toggle",
        toggleType: "on-off",
        identifierLabel: "Fan #",
        placeholder: "Enter #",
        required: true,
        defaultValue: true,
      },
      {
        id: "roof-exhaust-fan-4",
        label: "Exhaust Fan",
        type: "combined-toggle",
        toggleType: "on-off",
        identifierLabel: "Fan #",
        placeholder: "Enter #",
        required: true,
        defaultValue: true,
      },
    ],
  },
  {
    id: "elevator-mechanical",
    title: "Elevator / Mechanical Room",
    items: [
      {
        id: "elev-exhaust-fan",
        label: "Exhaust Fan",
        type: "combined-toggle",
        toggleType: "on-off",
        identifierLabel: "Fan #",
        required: true,
        defaultValue: true,
      },
      {
        id: "elev-evap-tank-1",
        label: "Evaporation Tank Level",
        type: "select",
        selectOptions: ["1/4", "2/4", "3/4"],
        required: true,
      },
      {
        id: "elev-evap-tank-2",
        label: "Evaporation Tank Level",
        type: "select",
        selectOptions: ["1/4", "2/4", "3/4"],
        required: true,
      },
      {
        id: "elev-fire-hose-pressure",
        label: "Fire Hose Cabinet Pressure",
        type: "number",
        required: true,
        unit: "PSI",
      },
    ],
  },
  {
    id: "corridor",
    title: "Corridor",
    items: [
      {
        id: "corridor-controller-pressure",
        label: "Controller Air Pressure",
        type: "number",
        unit: "PSI",
        required: true,
      },
      {
        id: "corridor-supply-fan",
        label: "Supply Fan",
        type: "combined-toggle",
        toggleType: "on-off",
        identifierLabel: "Fan #",
        placeholder: "Enter #",
        required: true,
      },
      {
        id: "corridor-controller-temp",
        label: "Controller Air Temperature",
        type: "number",
        unit: "°C",
        required: true,
      },
      { id: "corridor-circ-pump", label: "Circulation Pump", type: "on-off", required: true },
      {
        id: "corridor-supply-water-temp",
        label: "Supply Water Temperature",
        type: "number",
        unit: "°C",
        required: true,
      },
      {
        id: "corridor-return-water-temp",
        label: "Return Water Temperature",
        type: "number",
        unit: "°C",
        required: true,
      },
      { id: "corridor-outdoor-temp", label: "Outdoor Air Temperature", type: "number", unit: "°C", required: true },
    ],
  },
  {
    id: "ground-floor",
    title: "Ground Floor",
    items: [
      { id: "ground-intake-temp", label: "Intake Air Temperature", type: "number", unit: "°C", required: true },
      { id: "ground-supply-temp", label: "Supply Air Temperature", type: "number", unit: "°C", required: true },
      {
        id: "ground-controller-pressure",
        label: "Controller Air Pressure",
        type: "number",
        unit: "PSI",
        required: true,
      },
      {
        id: "ground-supply-fan",
        label: "Supply Fan",
        type: "combined-toggle",
        toggleType: "on-off",
        identifierLabel: "Fan #",
        placeholder: "Enter #",
        required: true,
      },
      { id: "ground-controller-temp", label: "Controller Air Temperature", type: "number", unit: "°C", required: true },
      { id: "ground-circ-pump", label: "Circulation Pump", type: "on-off", required: true },
      {
        id: "ground-exhaust-fan-1",
        label: "Exhaust Fan",
        type: "combined-toggle",
        toggleType: "on-off",
        identifierLabel: "Fan #",
        placeholder: "Enter #",
        required: true,
        defaultValue: true,
      },
      {
        id: "ground-exhaust-fan-2",
        label: "Exhaust Fan",
        type: "combined-toggle",
        toggleType: "on-off",
        identifierLabel: "Fan #",
        placeholder: "Enter #",
        required: true,
        defaultValue: true,
      },
    ],
  },
  {
    id: "sprinkler-room",
    title: "Sprinkler Room",
    items: [
      {
        id: "sprinkler-fire-pump-pressure",
        label: "Fire Pump Discharge Pressure",
        type: "number",
        unit: "PSI",
        required: true,
      },
      { id: "sprinkler-water-meter", label: "Water Meter Reading", type: "number", required: true },
      { id: "sprinkler-valves", label: "Sprinkler Valves", type: "open-closed", required: true, defaultValue: true },
    ],
  },
  {
    id: "boiler-room-1",
    title: "Boiler Room (1)",
    items: [
      {
        id: "boiler1-circ-pump-1",
        label: "Circulation Pump",
        type: "combined-toggle",
        toggleType: "on-off",
        identifierLabel: "Pump #",
        placeholder: "Enter #",
        required: true,
      },
      {
        id: "boiler1-circ-pump-1-suction-temp",
        label: "Suction Temperature",
        type: "number",
        unit: "°C",
        required: true,
      },
      {
        id: "boiler1-circ-pump-2",
        label: "Circulation Pump",
        type: "combined-toggle",
        toggleType: "on-off",
        identifierLabel: "Pump #",
        placeholder: "Enter #",
        required: true,
      },
      {
        id: "boiler1-circ-pump-2-supply-temp",
        label: "Supply Temperature",
        type: "number",
        unit: "°C",
        required: true,
      },
      {
        id: "boiler1-circ-pump-2-return-temp",
        label: "Return Temperature",
        type: "number",
        unit: "°C",
        required: true,
      },
      {
        id: "boiler1-controller-air-pressure",
        label: "Controller Air Pressure",
        type: "number",
        unit: "PSI",
        required: true,
      },
      {
        id: "boiler1-air-compressor-tank-pressure",
        label: "Air Compressor Tank Air Pressure",
        type: "number",
        unit: "PSI",
        required: true,
      },
      {
        id: "boiler1-bypass-prv-pressure",
        label: "Bypass PRV Air Pressure",
        type: "number",
        unit: "PSI",
        required: true,
      },
      { id: "boiler1-prv-1-pressure", label: "PRV Air Pressure", type: "number", unit: "PSI", required: true },
      { id: "boiler1-prv-2-pressure", label: "PRV Air Pressure", type: "number", unit: "PSI", required: true },
      { id: "boiler1-makeup-prv-pressure", label: "Make Up PRV Pressure", type: "number", unit: "PSI", required: true },
      {
        id: "boiler1-dcw-booster-1",
        label: "DCW Booster Pump",
        type: "combined-toggle",
        toggleType: "on-off",
        identifierLabel: "Pump #",
        placeholder: "Enter #",
        required: true,
      },
      {
        id: "boiler1-dcw-booster-1-pressure",
        label: "Discharge Pressure",
        type: "number",
        unit: "PSI",
        required: true,
      },
      {
        id: "boiler1-dcw-booster-2",
        label: "DCW Booster Pump",
        type: "combined-toggle",
        toggleType: "on-off",
        identifierLabel: "Pump #",
        placeholder: "Enter #",
        required: true,
      },
      {
        id: "boiler1-dcw-booster-2-pressure",
        label: "Discharge Pressure",
        type: "number",
        unit: "PSI",
        required: true,
      },
      {
        id: "boiler1-dcw-booster-3",
        label: "DCW Booster Pump",
        type: "combined-toggle",
        toggleType: "on-off",
        identifierLabel: "Pump #",
        placeholder: "Enter #",
        required: true,
      },
      {
        id: "boiler1-dcw-booster-3-pressure",
        label: "Discharge Pressure",
        type: "number",
        unit: "PSI",
        required: true,
      },
      {
        id: "boiler1-dcw-high-zone-pressure",
        label: "DCW High Zone Supply Pressure",
        type: "number",
        unit: "PSI",
        required: true,
      },
      {
        id: "boiler1-dcw-low-zone-pressure",
        label: "DCW Low Zone Supply Pressure",
        type: "number",
        unit: "PSI",
        required: true,
      },
    ],
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
      {
        id: "heat-high-controller-pressure",
        label: "Controller Air Pressure",
        type: "number",
        unit: "PSI",
        required: true,
      },
      {
        id: "heat-high-diff-pressure",
        label: "Differential Air Pressure",
        type: "number",
        unit: "PSI",
        required: true,
      },
    ],
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
      {
        id: "heat-low-controller-pressure",
        label: "Controller Air Pressure",
        type: "number",
        unit: "PSI",
        required: true,
      },
      { id: "heat-low-diff-pressure", label: "Differential Air Pressure", type: "number", unit: "PSI", required: true },
    ],
  },
  {
    id: "boiler-room-2",
    title: "Boiler Room (2)",
    items: [
      {
        id: "boiler2-primary-circ-pump",
        label: "Primary Circulation Pump",
        type: "combined-toggle",
        toggleType: "on-off",
        identifierLabel: "Pump #",
        placeholder: "Enter #",
        required: true,
      },
      {
        id: "boiler2-primary-discharge-pressure",
        label: "Discharge Pressure",
        type: "number",
        unit: "PSI",
        required: true,
      },
      {
        id: "boiler2-primary-discharge-temp",
        label: "Discharge Temperature",
        type: "number",
        unit: "°C",
        required: true,
      },
    ],
  },
  {
    id: "dhw-low-zone",
    title: "Domestic Hot Water Low Zone",
    items: [
      { id: "dhw-low-exchanger-pump", label: "Exchanger Circulation Pump", type: "on-off", required: true },
      { id: "dhw-low-inlet-temp", label: "Inlet Temperature", type: "number", unit: "°C", required: true },
      { id: "dhw-low-outlet-temp", label: "Outlet Temperature", type: "number", unit: "°C", required: true },
      {
        id: "dhw-low-recirc-1",
        label: "Recirculation Pump",
        type: "combined-toggle",
        toggleType: "on-off",
        identifierLabel: "Pump #",
        placeholder: "Enter #",
        required: true,
        defaultValue: true,
      },
      {
        id: "dhw-low-recirc-2",
        label: "Recirculation Pump",
        type: "combined-toggle",
        toggleType: "on-off",
        identifierLabel: "Pump #",
        placeholder: "Enter #",
        required: true,
        defaultValue: true,
      },
    ],
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
    ],
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
      {
        id: "ramp-expansion-level",
        label: "Expansion Tank Level",
        type: "select",
        selectOptions: ["1/4", "2/4", "3/4"],
        required: true,
      },
      { id: "ramp-expansion-pressure", label: "Expansion Tank Pressure", type: "number", unit: "PSI", required: true },
    ],
  },
  {
    id: "boiler-system",
    title: "Boiler System",
    items: [
      { id: "boiler-fuel-level", label: "Fuel Level", type: "number", unit: "%", required: true },
      {
        id: "boiler-1",
        label: "Boiler",
        type: "combined-toggle",
        toggleType: "on-off",
        identifierLabel: "Boiler #",
        placeholder: "Enter #",
        required: true,
      },
      { id: "boiler-1-pressure", label: "Pressure", type: "number", unit: "PSI", required: true },
      {
        id: "boiler-2",
        label: "Boiler",
        type: "combined-toggle",
        toggleType: "on-off",
        identifierLabel: "Boiler #",
        placeholder: "Enter #",
        required: true,
      },
      { id: "boiler-2-pressure", label: "Pressure", type: "number", unit: "PSI", required: true },
      {
        id: "boiler-supply-header-temp",
        label: "Supply Header Temperature",
        type: "number",
        unit: "°C",
        required: true,
      },
      {
        id: "boiler-return-header-temp",
        label: "Return Header Temperature",
        type: "number",
        unit: "°C",
        required: true,
      },
    ],
  },
  {
    id: "miscellaneous",
    title: "Miscellaneous",
    items: [{ id: "misc-sump-pumps", label: "Test Sump Pumps (Weekly)", type: "ok-issue", required: false }],
  },
  {
    id: "comments",
    title: "Comments",
    items: [
      {
        id: "comments",
        label: "",
        type: "textarea",
        placeholder: "Enter any additional observations or notes...",
        required: false,
      },
    ],
  },
];

// Flatten sections to items for backward compatibility
const flattenSections = (sections: FormSection[]): ChecklistItem[] => {
  return sections.flatMap((section) => section.items.map((item) => ({ ...item, category: section.title })));
};

export const formTemplates: FormTemplate[] = [
  {
    id: "daily-maintenance",
    name: "Daily Inspection",
    shortName: "Daily Inspection",
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
      {
        id: "fire-extinguishers",
        label: "Fire extinguishers - accessible and charged",
        type: "pass-fail",
        category: "Extinguishers",
        required: true,
      },
      {
        id: "fire-alarms",
        label: "Fire alarm panels - no faults",
        type: "pass-fail",
        category: "Alarms",
        required: true,
      },
      {
        id: "emergency-lighting",
        label: "Emergency lighting",
        type: "pass-fail",
        category: "Lighting",
        required: true,
      },
      { id: "exit-signs", label: "Exit signs illuminated", type: "pass-fail", category: "Signage", required: true },
      {
        id: "sprinkler-system",
        label: "Sprinkler system valves",
        type: "open-closed",
        category: "Sprinklers",
        required: true,
      },
      { id: "fire-doors", label: "Fire doors - self-closing", type: "pass-fail", category: "Doors", required: true },
    ],
  },
  {
    id: "mechanical-systems",
    name: "Monthly Mechanical Maintenance",
    shortName: "Mechanical",
    description: "Monthly mechanical equipment maintenance and inspection",
    icon: Wrench,
    color: "bg-warning",
    frequency: "monthly",
    estimatedTime: "60-90 min",
    hasExtendedFields: false,
    formCode: "#G-30-02",
    sections: [
      {
        id: "elevator-room",
        title: "Elevator Room",
        items: [
          { id: "tag-1", label: "Elevator Roof Vent Fan", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean"] },
          { id: "tag-2", label: "Heater", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean"] },
          { id: "tag-33", label: "Elevator Sump Pump", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean"], placeholder: "Clean sump pump and pit annually" },
        ],
      },
      {
        id: "floor-equipment",
        title: "Floor Equipment",
        items: [
          { id: "tag-3", label: "Pressurizing Fan", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean", "test"], placeholder: "____ Floor" },
          { id: "tag-76", label: "Recirculating Pump", type: "mechanical-maintenance", required: true, maintenanceActions: ["oil"], placeholder: "____ Floor Ceiling" },
        ],
      },
      {
        id: "boiler-room-roof",
        title: "Boiler Room, Roof",
        items: [
          { id: "tag-4", label: "Elevator Pressurization Fan", type: "mechanical-maintenance", required: true, maintenanceActions: ["test"] },
          { id: "tag-5", label: "East Pressurization Fan", type: "mechanical-maintenance", required: true, maintenanceActions: ["test"] },
          { id: "tag-6", label: "West Pressurization Fan", type: "mechanical-maintenance", required: true, maintenanceActions: ["test"] },
        ],
      },
      {
        id: "boiler-room",
        title: "Boiler Room",
        items: [
          { id: "tag-7", label: "Recirculation Pump D.H.W.", type: "mechanical-maintenance", required: true, maintenanceActions: ["oil", "lube"] },
          { id: "tag-8", label: "Recirculation Pump D.H.W. Boiler #2", type: "mechanical-maintenance", required: true, maintenanceActions: ["oil", "lube"] },
          { id: "tag-9", label: "D.H.W. Boiler #1", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean", "test"], placeholder: "Valve" },
          { id: "tag-10", label: "D.H.W. Boiler #2", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean", "test"], placeholder: "Valve" },
          { id: "tag-11", label: "D.H.W. Water Storage Tank", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean", "test"], placeholder: "Valve" },
          { id: "tag-12", label: "D.H.W. Recirculation Pump", type: "mechanical-maintenance", required: true, maintenanceActions: ["oil", "test"], placeholder: "Bearings" },
          { id: "tag-13", label: "Heating Boiler #1", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean", "test"], placeholder: "Valve" },
          { id: "tag-14", label: "Heating Boiler #2", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean", "test"], placeholder: "Valve" },
          { id: "tag-15", label: "Heating Boiler #3", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean", "test"], placeholder: "Valve" },
          { id: "tag-16", label: "Heating Boiler #4", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean", "test"], placeholder: "Valve" },
          { id: "tag-17", label: "Heating Expansion Tank", type: "mechanical-maintenance", required: true, maintenanceActions: ["test"], placeholder: "Drain annually" },
        ],
      },
      {
        id: "fan-room",
        title: "Fan Room",
        items: [
          { id: "tag-18", label: "Corridor Fresh Air Fan Expansion Tank", type: "mechanical-maintenance", required: true, maintenanceActions: [], placeholder: "Drain annually" },
          { id: "tag-19", label: "Heat Recirculation Pump #8", type: "mechanical-maintenance", required: true, maintenanceActions: ["oil"] },
          { id: "tag-20", label: "Corridor Fresh Air Fan Unit", type: "mechanical-maintenance", required: true, maintenanceActions: ["oil", "clean", "test", "lube", "filter"], placeholder: "Motor, shaft bearings, belts, glycol change" },
          { id: "tag-21", label: "Heater", type: "mechanical-maintenance", required: true, maintenanceActions: [] },
        ],
      },
      {
        id: "locker-rooms",
        title: "Locker Rooms",
        items: [
          { id: "tag-22", label: "Exhaust Fan Motor", type: "mechanical-maintenance", required: true, maintenanceActions: ["oil", "lube"], placeholder: "Belt size ___________" },
          { id: "tag-26", label: "Heating Loop Recirculation Pump", type: "mechanical-maintenance", required: true, maintenanceActions: ["oil", "test"], placeholder: "Pressure" },
          { id: "tag-27", label: "Exhaust Fan Motor", type: "mechanical-maintenance", required: true, maintenanceActions: ["oil", "lube"] },
        ],
      },
      {
        id: "electrical-rooms",
        title: "Electrical Rooms",
        items: [
          { id: "tag-23", label: "Exhaust Fan Motor", type: "mechanical-maintenance", required: true, maintenanceActions: ["oil", "lube"], placeholder: "Bearings, belts oil every ___ months" },
          { id: "tag-24", label: "Exhaust Fan Motor (by Security Room)", type: "mechanical-maintenance", required: true, maintenanceActions: ["oil", "lube"], placeholder: "Bearings, belts oil every ___ months" },
          { id: "tag-25", label: "Exhaust Fan Motor", type: "mechanical-maintenance", required: true, maintenanceActions: ["oil", "lube"], placeholder: "Bearings, belts oil every ___ months" },
        ],
      },
      {
        id: "garage",
        title: "Garage",
        items: [
          { id: "tag-28", label: "Garage Exhaust Fans", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean", "test", "lube"], placeholder: "Belts" },
          { id: "tag-45", label: "Garage Exhaust Fans", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean", "test", "lube"], placeholder: "Belts, Louvers" },
          { id: "tag-79", label: "Garage Door Operator and Door", type: "mechanical-maintenance", required: true, maintenanceActions: ["oil", "clean", "test", "lube"], placeholder: "Top of Garage Ramp" },
        ],
      },
      {
        id: "sprinkler-room",
        title: "Sprinkler Room",
        items: [
          { id: "tag-29", label: "Booster Pumps D.C.W.", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean", "test"], placeholder: "Pressure" },
          { id: "tag-30", label: "Fire Pump", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean", "test"], placeholder: "Pressure, bearings" },
          { id: "tag-30a", label: "Jockey Pump", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean"] },
          { id: "tag-31", label: "Exhaust Fan", type: "mechanical-maintenance", required: true, maintenanceActions: [] },
          { id: "tag-32", label: "Air Compressor (Dry Sprinkler)", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean"], placeholder: "Air pressure, oil belt, clean air filter, annually change oil" },
        ],
      },
      {
        id: "chiller-room",
        title: "Chiller Room",
        items: [
          { id: "tag-34", label: "Chiller Room Heater", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean"] },
          { id: "tag-35", label: "Cooling Tower", type: "mechanical-maintenance", required: true, maintenanceActions: ["oil", "clean"], placeholder: "Motor & Bearings" },
          { id: "tag-36", label: "Y Strainer Fan Cooling Tower", type: "mechanical-maintenance", required: true, maintenanceActions: [] },
          { id: "tag-37", label: "Condenser Pump", type: "mechanical-maintenance", required: true, maintenanceActions: [] },
          { id: "tag-38", label: "Chemical Injector Pump", type: "mechanical-maintenance", required: true, maintenanceActions: [] },
          { id: "tag-39", label: "Exhaust Fan", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean"] },
          { id: "tag-40", label: "Chemical Filter", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean"] },
          { id: "tag-41", label: "Dual Temp Circulation Pump #1", type: "mechanical-maintenance", required: true, maintenanceActions: [], placeholder: "Bearings" },
          { id: "tag-42", label: "Dual Temp Circulation Pump #2", type: "mechanical-maintenance", required: true, maintenanceActions: [], placeholder: "Bearings" },
          { id: "tag-43", label: "Suction Guider Dual Temp Pipes", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean"], placeholder: "Strainer" },
          { id: "tag-44", label: "Suction Guide", type: "mechanical-maintenance", required: true, maintenanceActions: ["clean"], placeholder: "Strainer Monthly" },
        ],
      },
      {
        id: "service-corridor",
        title: "Service Corridor",
        items: [
          { id: "tag-77", label: "Exhaust Fan & Motor", type: "mechanical-maintenance", required: true, maintenanceActions: ["oil", "lube"] },
          { id: "tag-78", label: "Booster Recirculation Pump", type: "mechanical-maintenance", required: true, maintenanceActions: ["test"], placeholder: "Check and lube" },
        ],
      },
    ],
    items: [],
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
        ],
      },
      {
        id: "guest-suites",
        title: "Guest Suites",
        items: [
          { id: "guest-hardware", label: "Hardware", type: "ok-issue", required: true },
          { id: "guest-bathroom", label: "Bathroom", type: "ok-issue", required: true },
          { id: "guest-linens", label: "Linens", type: "ok-issue", required: true },
        ],
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
      {
        id: "weight-equipment",
        label: "Weight machines and free weights",
        type: "ok-issue",
        category: "Equipment",
        required: true,
      },
      {
        id: "gym-cleanliness",
        label: "Gym floor cleanliness",
        type: "ok-issue",
        category: "Cleanliness",
        required: true,
      },
      {
        id: "gym-ventilation",
        label: "Ventilation and air quality",
        type: "ok-issue",
        category: "Environment",
        required: true,
      },
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
      {
        id: "deficiency-location",
        label: "Location of issue",
        type: "text",
        category: "Details",
        required: true,
        placeholder: "e.g., Unit 302, Lobby, Parking P2",
      },
      {
        id: "deficiency-description",
        label: "Description of deficiency",
        type: "textarea",
        category: "Details",
        required: true,
        placeholder: "Describe the issue in detail...",
      },
      {
        id: "deficiency-priority",
        label: "Priority level assessment",
        type: "pass-fail",
        category: "Priority",
        required: true,
      },
      {
        id: "deficiency-action",
        label: "Recommended action",
        type: "textarea",
        category: "Action",
        required: false,
        placeholder: "What needs to be done to fix this?",
      },
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
