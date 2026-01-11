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
  | "number";

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
    description: "Comprehensive daily walkthrough covering parking, roof, boiler room, and mechanical systems",
    icon: ClipboardCheck,
    color: "bg-primary",
    frequency: "daily",
    estimatedTime: "25-35 min",
    items: [
      // ===== PARKING & EXTERIOR =====
      { id: "parking-residential", label: "Residential parking – P2, P3, P4 – storage items on parking spots", type: "ok-issue", category: "Parking & Exterior", required: true },
      { id: "parking-visitors", label: "Visitors parking – P1", type: "ok-issue", category: "Parking & Exterior", required: true },
      { id: "building-exterior", label: "Building exterior", type: "ok-issue", category: "Parking & Exterior", required: true },

      // ===== ROOF – FAN ROOM =====
      { id: "roof-exhaust-fan-1-num", label: "Exhaust Fan #", type: "text", category: "Roof – Fan Room", placeholder: "Enter fan number" },
      { id: "roof-exhaust-fan-1-status", label: "Exhaust Fan #1 Status", type: "on-off", category: "Roof – Fan Room", required: true, defaultValue: true },
      { id: "roof-exhaust-fan-2-num", label: "Exhaust Fan #", type: "text", category: "Roof – Fan Room", placeholder: "Enter fan number" },
      { id: "roof-exhaust-fan-2-status", label: "Exhaust Fan #2 Status", type: "on-off", category: "Roof – Fan Room", required: true, defaultValue: true },
      { id: "roof-exhaust-fan-3-num", label: "Exhaust Fan #", type: "text", category: "Roof – Fan Room", placeholder: "Enter fan number" },
      { id: "roof-exhaust-fan-3-status", label: "Exhaust Fan #3 Status", type: "on-off", category: "Roof – Fan Room", required: true, defaultValue: true },
      { id: "roof-exhaust-fan-4-num", label: "Exhaust Fan #", type: "text", category: "Roof – Fan Room", placeholder: "Enter fan number" },
      { id: "roof-exhaust-fan-4-status", label: "Exhaust Fan #4 Status", type: "on-off", category: "Roof – Fan Room", required: true, defaultValue: true },

      // ===== ELEVATOR / MECHANICAL ROOM =====
      { id: "elev-exhaust-fan-num", label: "Exhaust Fan #", type: "text", category: "Elevator / Mechanical Room", placeholder: "Enter fan number" },
      { id: "elev-exhaust-fan-status", label: "Exhaust Fan Status", type: "on-off", category: "Elevator / Mechanical Room", required: true, defaultValue: true },
      { id: "elev-evap-tank-1-num", label: "Evaporation Tank Level #", type: "text", category: "Elevator / Mechanical Room", placeholder: "Enter tank number" },
      { id: "elev-evap-tank-1-level", label: "Evaporation Tank #1 Level", type: "text", category: "Elevator / Mechanical Room", required: true, placeholder: "¼ - ¾" },
      { id: "elev-evap-tank-2-num", label: "Evaporation Tank Level #", type: "text", category: "Elevator / Mechanical Room", placeholder: "Enter tank number" },
      { id: "elev-evap-tank-2-level", label: "Evaporation Tank #2 Level", type: "text", category: "Elevator / Mechanical Room", required: true, placeholder: "¼ - ¾" },
      { id: "elev-fire-hose-pressure", label: "Fire Hose Cabinet Pressure", type: "number", category: "Elevator / Mechanical Room", required: true, unit: "PSI" },

      // ===== GROUND FLOOR CORRIDOR FRESH AIR SUPPLY =====
      { id: "ground-fan-num", label: "Fan #", type: "text", category: "Ground Floor Corridor", placeholder: "Enter fan number" },
      { id: "ground-fan-status", label: "Fan Status", type: "on-off", category: "Ground Floor Corridor", required: true, defaultValue: true },
      { id: "ground-intake-temp", label: "Intake Air Temperature", type: "number", category: "Ground Floor Corridor", required: true, unit: "°C" },
      { id: "ground-supply-temp", label: "Supply Air Temperature", type: "number", category: "Ground Floor Corridor", required: true, unit: "°C" },
      { id: "ground-controller-1-num", label: "Controller #", type: "text", category: "Ground Floor Corridor", placeholder: "Enter controller number" },
      { id: "ground-controller-1-pressure", label: "Controller #1 Air Pressure", type: "number", category: "Ground Floor Corridor", required: true, unit: "PSI" },
      { id: "ground-controller-2-num", label: "Controller #", type: "text", category: "Ground Floor Corridor", placeholder: "Enter controller number" },
      { id: "ground-controller-2-temp", label: "Controller #2 Air Temperature", type: "number", category: "Ground Floor Corridor", required: true, unit: "°C" },
      { id: "ground-circ-pump", label: "Circulation Pump", type: "on-off", category: "Ground Floor Corridor", required: true },
      { id: "ground-exhaust-fan-1-num", label: "Exhaust Fan #", type: "text", category: "Ground Floor Corridor", placeholder: "Enter fan number" },
      { id: "ground-exhaust-fan-1-status", label: "Exhaust Fan #1 Status", type: "on-off", category: "Ground Floor Corridor", required: true, defaultValue: true },
      { id: "ground-exhaust-fan-2-num", label: "Exhaust Fan #", type: "text", category: "Ground Floor Corridor", placeholder: "Enter fan number" },
      { id: "ground-exhaust-fan-2-status", label: "Exhaust Fan #2 Status", type: "on-off", category: "Ground Floor Corridor", required: true, defaultValue: true },

      // ===== SPRINKLER ROOM =====
      { id: "sprinkler-fire-pump-pressure", label: "Fire Pump Discharge Pressure", type: "number", category: "Sprinkler Room", required: true, unit: "PSI" },
      { id: "sprinkler-water-meter", label: "Water Meter Reading", type: "number", category: "Sprinkler Room", required: true },
      { id: "sprinkler-valves", label: "Sprinkler Valves", type: "open-closed", category: "Sprinkler Room", required: true, defaultValue: true },

      // ===== BOILER ROOM (Page 1) =====
      { id: "boiler1-circ-pump-1-num", label: "Circulation Pump #", type: "text", category: "Boiler Room (1)", placeholder: "Enter pump number" },
      { id: "boiler1-circ-pump-1-status", label: "Circulation Pump #1 Status", type: "on-off", category: "Boiler Room (1)", required: true },
      { id: "boiler1-circ-pump-1-suction-temp", label: "Circulation Pump #1 Suction Temperature", type: "number", category: "Boiler Room (1)", required: true, unit: "°C" },
      { id: "boiler1-circ-pump-2-num", label: "Circulation Pump #", type: "text", category: "Boiler Room (1)", placeholder: "Enter pump number" },
      { id: "boiler1-circ-pump-2-status", label: "Circulation Pump #2 Status", type: "on-off", category: "Boiler Room (1)", required: true },
      { id: "boiler1-circ-pump-2-supply-temp", label: "Circulation Pump #2 Supply Temperature", type: "number", category: "Boiler Room (1)", required: true, unit: "°C" },
      { id: "boiler1-circ-pump-2-return-temp", label: "Circulation Pump #2 Return Temperature", type: "number", category: "Boiler Room (1)", required: true, unit: "°C" },
      { id: "boiler1-controller-air-pressure", label: "Controller Air Pressure", type: "number", category: "Boiler Room (1)", required: true, unit: "PSI" },
      { id: "boiler1-air-compressor-tank-pressure", label: "Air Compressor Tank Air Pressure", type: "number", category: "Boiler Room (1)", required: true, unit: "PSI" },
      { id: "boiler1-bypass-prv-pressure", label: "Bypass PRV Air Pressure", type: "number", category: "Boiler Room (1)", required: true, unit: "PSI" },
      { id: "boiler1-prv-1-num", label: "PRV #", type: "text", category: "Boiler Room (1)", placeholder: "Enter PRV number" },
      { id: "boiler1-prv-1-pressure", label: "PRV #1 Air Pressure", type: "number", category: "Boiler Room (1)", required: true, unit: "PSI" },
      { id: "boiler1-prv-2-num", label: "PRV #", type: "text", category: "Boiler Room (1)", placeholder: "Enter PRV number" },
      { id: "boiler1-prv-2-pressure", label: "PRV #2 Air Pressure", type: "number", category: "Boiler Room (1)", required: true, unit: "PSI" },
      { id: "boiler1-makeup-prv-pressure", label: "Make Up PRV Pressure", type: "number", category: "Boiler Room (1)", required: true, unit: "PSI" },
      { id: "boiler1-dcw-booster-1-num", label: "DCW Booster Pump #", type: "text", category: "Boiler Room (1)", placeholder: "Enter pump number" },
      { id: "boiler1-dcw-booster-1-status", label: "DCW Booster Pump #1 Status", type: "on-off", category: "Boiler Room (1)", required: true },
      { id: "boiler1-dcw-booster-1-pressure", label: "DCW Booster Pump #1 Discharge Pressure", type: "number", category: "Boiler Room (1)", required: true, unit: "PSI" },
      { id: "boiler1-dcw-booster-2-num", label: "DCW Booster Pump #", type: "text", category: "Boiler Room (1)", placeholder: "Enter pump number" },
      { id: "boiler1-dcw-booster-2-status", label: "DCW Booster Pump #2 Status", type: "on-off", category: "Boiler Room (1)", required: true },
      { id: "boiler1-dcw-booster-2-pressure", label: "DCW Booster Pump #2 Discharge Pressure", type: "number", category: "Boiler Room (1)", required: true, unit: "PSI" },
      { id: "boiler1-dcw-booster-3-num", label: "DCW Booster Pump #", type: "text", category: "Boiler Room (1)", placeholder: "Enter pump number" },
      { id: "boiler1-dcw-booster-3-status", label: "DCW Booster Pump #3 Status", type: "on-off", category: "Boiler Room (1)", required: true },
      { id: "boiler1-dcw-booster-3-pressure", label: "DCW Booster Pump #3 Discharge Pressure", type: "number", category: "Boiler Room (1)", required: true, unit: "PSI" },
      { id: "boiler1-dcw-high-zone-pressure", label: "DCW High Zone Supply Pressure", type: "number", category: "Boiler Room (1)", required: true, unit: "PSI" },
      { id: "boiler1-dcw-low-zone-pressure", label: "DCW Low Zone Supply Pressure", type: "number", category: "Boiler Room (1)", required: true, unit: "PSI" },

      // Building Heating High Zone
      { id: "boiler1-heat-high-design-temp", label: "Building Heating High Zone - Design Temperature", type: "number", category: "Boiler Room (1)", required: true, unit: "°C" },
      { id: "boiler1-heat-high-supply-temp", label: "Building Heating High Zone - Supply Temperature", type: "number", category: "Boiler Room (1)", required: true, unit: "°C" },
      { id: "boiler1-heat-high-return-temp", label: "Building Heating High Zone - Return Temperature", type: "number", category: "Boiler Room (1)", required: true, unit: "°C" },
      { id: "boiler1-heat-high-circ-pump", label: "Building Heating High Zone - Circulation Pump", type: "on-off", category: "Boiler Room (1)", required: true },
      { id: "boiler1-heat-high-suction-pressure", label: "Building Heating High Zone - Suction Pressure", type: "number", category: "Boiler Room (1)", required: true, unit: "PSI" },
      { id: "boiler1-heat-high-discharge-pressure", label: "Building Heating High Zone - Discharge Pressure", type: "number", category: "Boiler Room (1)", required: true, unit: "PSI" },
      { id: "boiler1-heat-high-controller-pressure", label: "Building Heating High Zone - Controller Air Pressure", type: "number", category: "Boiler Room (1)", required: true, unit: "PSI" },
      { id: "boiler1-heat-high-diff-pressure", label: "Building Heating High Zone - Differential Air Pressure", type: "number", category: "Boiler Room (1)", required: true, unit: "PSI" },

      // Building Heating Low Zone
      { id: "boiler1-heat-low-design-temp", label: "Building Heating Low Zone - Design Temperature", type: "number", category: "Boiler Room (1)", required: true, unit: "°C" },
      { id: "boiler1-heat-low-supply-temp", label: "Building Heating Low Zone - Supply Temperature", type: "number", category: "Boiler Room (1)", required: true, unit: "°C" },
      { id: "boiler1-heat-low-return-temp", label: "Building Heating Low Zone - Return Temperature", type: "number", category: "Boiler Room (1)", required: true, unit: "°C" },
      { id: "boiler1-heat-low-circ-pump", label: "Building Heating Low Zone - Circulation Pump", type: "on-off", category: "Boiler Room (1)", required: true },
      { id: "boiler1-heat-low-suction-pressure", label: "Building Heating Low Zone - Suction Pressure", type: "number", category: "Boiler Room (1)", required: true, unit: "PSI" },
      { id: "boiler1-heat-low-discharge-pressure", label: "Building Heating Low Zone - Discharge Pressure", type: "number", category: "Boiler Room (1)", required: true, unit: "PSI" },
      { id: "boiler1-heat-low-controller-pressure", label: "Building Heating Low Zone - Controller Air Pressure", type: "number", category: "Boiler Room (1)", required: true, unit: "PSI" },
      { id: "boiler1-heat-low-diff-pressure", label: "Building Heating Low Zone - Differential Air Pressure", type: "number", category: "Boiler Room (1)", required: true, unit: "PSI" },

      // ===== BOILER ROOM (Page 2) =====
      { id: "boiler2-primary-circ-pump-num", label: "Primary Circulation Pump #", type: "text", category: "Boiler Room (2)", placeholder: "Enter pump number" },
      { id: "boiler2-primary-circ-pump-status", label: "Primary Circulation Pump Status", type: "on-off", category: "Boiler Room (2)", required: true },
      { id: "boiler2-primary-circ-discharge-pressure", label: "Primary Circulation Pump - Discharge Pressure", type: "number", category: "Boiler Room (2)", required: true, unit: "PSI" },
      { id: "boiler2-primary-circ-discharge-temp", label: "Primary Circulation Pump - Discharge Temperature", type: "number", category: "Boiler Room (2)", required: true, unit: "°C" },

      // Domestic Hot Water Low Zone
      { id: "boiler2-dhw-low-exchanger-pump", label: "DHW Low Zone - Exchanger Circulation Pump", type: "on-off", category: "Boiler Room (2)", required: true },
      { id: "boiler2-dhw-low-inlet-temp", label: "DHW Low Zone - Inlet Temperature", type: "number", category: "Boiler Room (2)", required: true, unit: "°C" },
      { id: "boiler2-dhw-low-outlet-temp", label: "DHW Low Zone - Outlet Temperature", type: "number", category: "Boiler Room (2)", required: true, unit: "°C" },
      { id: "boiler2-dhw-low-recirc-1-num", label: "DHW Low Zone - Recirculation Pump #", type: "text", category: "Boiler Room (2)", placeholder: "Enter pump number" },
      { id: "boiler2-dhw-low-recirc-1-status", label: "DHW Low Zone - Recirculation Pump #1 Status", type: "on-off", category: "Boiler Room (2)", required: true, defaultValue: true },
      { id: "boiler2-dhw-low-recirc-2-num", label: "DHW Low Zone - Recirculation Pump #", type: "text", category: "Boiler Room (2)", placeholder: "Enter pump number" },
      { id: "boiler2-dhw-low-recirc-2-status", label: "DHW Low Zone - Recirculation Pump #2 Status", type: "on-off", category: "Boiler Room (2)", required: true, defaultValue: true },

      // Domestic Hot Water High Zone
      { id: "boiler2-dhw-high-exchanger-pump", label: "DHW High Zone - Exchanger Circulation Pump", type: "on-off", category: "Boiler Room (2)", required: true },
      { id: "boiler2-dhw-high-inlet-temp", label: "DHW High Zone - Inlet Temperature", type: "number", category: "Boiler Room (2)", required: true, unit: "°C" },
      { id: "boiler2-dhw-high-inlet-pressure", label: "DHW High Zone - Inlet Pressure", type: "number", category: "Boiler Room (2)", required: true, unit: "PSI" },
      { id: "boiler2-dhw-high-outlet-temp", label: "DHW High Zone - Outlet Temperature", type: "number", category: "Boiler Room (2)", required: true, unit: "°C" },
      { id: "boiler2-dhw-high-outlet-pressure", label: "DHW High Zone - Outlet Pressure", type: "number", category: "Boiler Room (2)", required: true, unit: "PSI" },
      { id: "boiler2-dhw-high-recirc-pump", label: "DHW High Zone - Recirculation Pump", type: "on-off", category: "Boiler Room (2)", required: true, defaultValue: true },

      // Ramp Heating System
      { id: "boiler2-ramp-exchanger-pump", label: "Ramp Heating System - Exchanger Circulation Pump", type: "on-off", category: "Boiler Room (2)", required: true },
      { id: "boiler2-ramp-inlet-temp", label: "Ramp Heating System - Inlet Temperature", type: "number", category: "Boiler Room (2)", required: true, unit: "°C" },
      { id: "boiler2-ramp-outlet-temp", label: "Ramp Heating System - Outlet Temperature", type: "number", category: "Boiler Room (2)", required: true, unit: "°C" },
      { id: "boiler2-ramp-glycol-pump", label: "Ramp Heating System - Glycol Circulation Pump", type: "on-off", category: "Boiler Room (2)", required: true },
      { id: "boiler2-ramp-supply-temp", label: "Ramp Heating System - Supply Temperature", type: "number", category: "Boiler Room (2)", required: true, unit: "°C" },
      { id: "boiler2-ramp-expansion-level", label: "Ramp Heating System - Expansion Tank Level", type: "text", category: "Boiler Room (2)", required: true, placeholder: "¼ - ¾" },
      { id: "boiler2-ramp-expansion-pressure", label: "Ramp Heating System - Expansion Tank Pressure", type: "number", category: "Boiler Room (2)", required: true, unit: "PSI" },

      // Boiler System
      { id: "boiler2-fuel-level", label: "Boiler System - Fuel Level", type: "number", category: "Boiler Room (2)", required: true, unit: "%" },
      { id: "boiler2-boiler-1-num", label: "Boiler #", type: "text", category: "Boiler Room (2)", placeholder: "Enter boiler number" },
      { id: "boiler2-boiler-1-status", label: "Boiler #1 Status", type: "on-off", category: "Boiler Room (2)", required: true },
      { id: "boiler2-boiler-1-pressure", label: "Boiler #1 Pressure", type: "number", category: "Boiler Room (2)", required: true, unit: "PSI" },
      { id: "boiler2-boiler-2-num", label: "Boiler #", type: "text", category: "Boiler Room (2)", placeholder: "Enter boiler number" },
      { id: "boiler2-boiler-2-status", label: "Boiler #2 Status", type: "on-off", category: "Boiler Room (2)", required: true },
      { id: "boiler2-boiler-2-pressure", label: "Boiler #2 Pressure", type: "number", category: "Boiler Room (2)", required: true, unit: "PSI" },
      { id: "boiler2-supply-header-temp", label: "Supply Header Temperature", type: "number", category: "Boiler Room (2)", required: true, unit: "°C" },
      { id: "boiler2-return-header-temp", label: "Return Header Temperature", type: "number", category: "Boiler Room (2)", required: true, unit: "°C" },

      // Miscellaneous
      { id: "misc-test-sump-pumps", label: "Test Sump Pumps (Weekly)", type: "text", category: "Miscellaneous", placeholder: "Enter test notes" },

      // ===== COMMENTS =====
      { id: "comments", label: "Additional Comments", type: "textarea", category: "Comments", placeholder: "Enter any additional observations or notes..." },
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
      { id: "notes", label: "Additional observations", type: "textarea", category: "Notes" },
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
      { id: "notes", label: "Additional observations", type: "textarea", category: "Notes" },
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
      { id: "notes", label: "Additional observations", type: "textarea", category: "Notes" },
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
      { id: "water-2", label: "Hot water temperature", type: "number", category: "Water Supply", unit: "°C" },
      { id: "water-3", label: "No visible leaks", type: "pass-fail", category: "Water Supply", required: true },
      { id: "drain-1", label: "Floor drains clear", type: "pass-fail", category: "Drainage" },
      { id: "drain-2", label: "Sump pumps operational", type: "pass-fail", category: "Drainage", required: true },
      { id: "boiler-1", label: "Boiler room condition", type: "ok-issue", category: "Mechanical" },
      { id: "boiler-2", label: "Pressure gauges normal", type: "pass-fail", category: "Mechanical" },
      { id: "common-1", label: "Common area fixtures", type: "ok-issue", category: "Fixtures" },
      { id: "common-2", label: "Laundry room drains", type: "ok-issue", category: "Fixtures" },
      { id: "notes", label: "Additional observations", type: "textarea", category: "Notes" },
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
      { id: "notes", label: "Additional observations", type: "textarea", category: "Notes" },
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
      { id: "notes", label: "Additional observations", type: "textarea", category: "Notes" },
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
      { id: "notes", label: "Additional observations", type: "textarea", category: "Notes" },
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
      { id: "description", label: "Description of issue", type: "textarea", category: "Details", required: true },
      { id: "severity", label: "Severity level (1-5)", type: "number", category: "Assessment", required: true },
      { id: "safety", label: "Safety hazard present", type: "pass-fail", category: "Assessment", required: true },
      { id: "urgent", label: "Requires immediate attention", type: "pass-fail", category: "Assessment" },
      { id: "contractor", label: "Contractor required", type: "pass-fail", category: "Action" },
      { id: "estimated-cost", label: "Estimated repair cost", type: "number", category: "Action", unit: "$" },
      { id: "timeline", label: "Suggested repair timeline", type: "text", category: "Action" },
      { id: "notes", label: "Additional notes", type: "textarea", category: "Notes" },
    ],
  },
];

export const getFormTemplate = (id: string): FormTemplate | undefined => {
  return formTemplates.find((template) => template.id === id);
};

export const getFormsByFrequency = (frequency: "daily" | "weekly" | "monthly") => {
  return formTemplates.filter((template) => template.frequency === frequency);
};
