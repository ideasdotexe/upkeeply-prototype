import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { CompletedInspection, InspectionResponse } from "./inspectionsStore";
import { getFormTemplate, MechanicalMaintenanceValue } from "./formTemplates";
import { supabase } from "@/integrations/supabase/client";

interface LoginInfo {
  companyId: string;
  buildingId: string;
  username: string;
  fullName?: string;
  sessionToken?: string;
}

interface BuildingInfo {
  name: string;
  address: string | null;
  building_type: string | null;
  year_built: number | null;
  units: number | null;
  floors: number | null;
  parking_spots: number | null;
  amenities: string | null;
}

function getLoginInfo(): LoginInfo {
  try {
    const stored = localStorage.getItem("loginInfo");
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Failed to parse login info:", e);
  }
  return { companyId: "", buildingId: "", username: "", sessionToken: "" };
}

async function getBuildingInfo(buildingId: string, sessionToken: string): Promise<BuildingInfo | null> {
  if (!buildingId) return null;
  
  // Validate building ID format before making request
  if (buildingId.length > 100 || !/^[a-zA-Z0-9\s\-_.]+$/.test(buildingId)) {
    console.error("Invalid building ID format");
    return null;
  }

  if (!sessionToken) {
    console.error("No session token available");
    return null;
  }
  
  try {
    // Use secure Edge Function to fetch building info with JWT token
    const { data, error } = await supabase.functions.invoke("get-building-info", {
      body: { 
        buildingId: buildingId.trim(),
        sessionToken: sessionToken
      },
    });
    
    if (error) {
      console.error("Error fetching building info:", error);
      return null;
    }
    
    if (data?.success && data?.building) {
      return data.building;
    }
    
    return null;
  } catch (err) {
    console.error("Unexpected error fetching building info:", err);
    return null;
  }
}

export async function generateInspectionPDF(inspection: CompletedInspection): Promise<void> {
  const template = getFormTemplate(inspection.formId);
  
  if (!template) {
    console.error("Template not found for:", inspection.formId);
    return;
  }
  
  // Use actual stored responses, or empty object if none
  const responses = inspection.responses || {};
  const completedDate = new Date(inspection.completedAt);
  const loginInfo = getLoginInfo();
  
  // Fetch building info from database
  // Fetch building info from database with session token
  const buildingInfo = await getBuildingInfo(loginInfo.buildingId, loginInfo.sessionToken || "");
  
  // Only include extended header for forms with hasExtendedFields
  const hasExtendedHeader = template.hasExtendedFields === true;
  
  // Create PDF in landscape mode
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  
  let yPosition = 15;
  
  if (hasExtendedHeader) {
    // Extended header for Amenities, Parking Garage, Exterior forms
    
    // Logo placeholder (Upkeeply text)
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(220, 53, 69); // Red color like in the reference image
    doc.text("Upkeeply", margin, yPosition);
    
    // Form code on the right
    if (template.formCode) {
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(template.formCode, pageWidth - margin, yPosition, { align: "right" });
    }
    
    yPosition += 10;
    
    // Form title - underlined and centered
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    const titleText = `BUILDING INSPECTION REPORT - ${template.shortName.toUpperCase()}`;
    doc.text(titleText, pageWidth / 2, yPosition, { align: "center" });
    
    // Underline the title
    const titleWidth = doc.getTextWidth(titleText);
    const titleX = (pageWidth - titleWidth) / 2;
    doc.setLineWidth(0.5);
    doc.line(titleX, yPosition + 1, titleX + titleWidth, yPosition + 1);
    
    yPosition += 12;
    
    // Corporation No and Address row
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const leftColX = margin;
    const rightColX = pageWidth / 2 + 10;
    
    // Corporation No (from Company ID)
    doc.text(`Corporation No: ${loginInfo.companyId || "________________"}`, leftColX, yPosition);
    // Address (from Building Info - use address from database, fallback to buildingId)
    const displayAddress = buildingInfo?.address || loginInfo.buildingId || "_________________________";
    doc.text(`Address: ${displayAddress}`, rightColX, yPosition);
    
    yPosition += 8;
    
    // Date and Inspected By row
    doc.text(`Date: ${format(completedDate, "MMMM d, yyyy")}`, leftColX, yPosition);
    // Inspected By (from fullName or username)
    const inspectedBy = loginInfo.fullName || loginInfo.username || "________________";
    doc.text(`Inspected By: ${inspectedBy}`, rightColX, yPosition);
    
    yPosition += 8;
    
    // Building details row (if available from database)
    if (buildingInfo) {
      const buildingDetails: string[] = [];
      if (buildingInfo.building_type) buildingDetails.push(`Type: ${buildingInfo.building_type}`);
      if (buildingInfo.units) buildingDetails.push(`Units: ${buildingInfo.units}`);
      if (buildingInfo.floors) buildingDetails.push(`Floors: ${buildingInfo.floors}`);
      
      if (buildingDetails.length > 0) {
        doc.text(`Building: ${buildingInfo.name || loginInfo.buildingId}`, leftColX, yPosition);
        doc.text(buildingDetails.join(" | "), rightColX, yPosition);
        yPosition += 8;
      }
    }
    
    // Line separator
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    
    yPosition += 7;
  } else {
    // Standard header for other forms
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(template.name.toUpperCase(), pageWidth / 2, 20, { align: "center" });
    
    // Sub-header info
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    
    // Building name on left
    const buildingName = buildingInfo?.name || loginInfo.buildingId || "Building";
    doc.text(`BUILDING: ${buildingName.toUpperCase()}`, margin, 30);
    
    doc.text(`DATE: ${format(completedDate, "MMMM d, yyyy")}`, margin, 36);
    doc.text(`TIME: ${format(completedDate, "h:mm a")}`, margin, 42);
    
    // Inspected by
    const inspectedBy = loginInfo.fullName || loginInfo.username || "";
    if (inspectedBy) {
      doc.text(`INSPECTED BY: ${inspectedBy.toUpperCase()}`, margin, 48);
    }
    
    doc.text(`STATUS: ${inspection.status === "completed" ? "COMPLETED" : "ISSUES FOUND"}`, pageWidth - margin - 50, 30);
    doc.text(`ITEMS: ${inspection.itemsCount}`, pageWidth - margin - 50, 36);
    if (inspection.issuesCount) {
      doc.text(`ISSUES: ${inspection.issuesCount}`, pageWidth - margin - 50, 42);
    }
    
    // Line separator
    doc.setLineWidth(0.5);
    doc.line(margin, 54, pageWidth - margin, 54);
    
    yPosition = 61;
  }
  
  // Helper function to generate table for items
  const generateItemsTable = (items: typeof template.items, sectionTitle?: string) => {
    if (items.length === 0) return;
    
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Section header (if provided)
    if (sectionTitle) {
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, yPosition - 5, pageWidth - margin * 2, 8, "F");
      doc.text(sectionTitle, margin + 3, yPosition);
      yPosition += 10;
    }
    
    // Prepare table data
    const tableData: (string | { content: string; styles: { fillColor?: [number, number, number] } })[][] = [];
    
    items.forEach(item => {
      const response = responses[item.id] as InspectionResponse | undefined;
      let displayValue = "-"; // Empty/not filled shows as dash
      let hasIssue = false;
      let noteOrDescription = "";
      let actionBy = "";
      let completionDate = "";
      
      if (response) {
        // Handle both formats: 
        // 1. New format: { value: { mainValue: ..., description: ... }, note: ... }
        // 2. Old format: { value: "ok" | "issue" | ..., note: ... }
        let value: string | boolean | number | { identifier?: string; status?: boolean | null } | MechanicalMaintenanceValue | null = null;
        
        if (response.value !== undefined && response.value !== null) {
          const rawValue = response.value;
          
          // Check if it's the new ExtendedValue format with mainValue
          if (typeof rawValue === "object" && rawValue !== null && "mainValue" in rawValue) {
            const extendedValue = rawValue as { 
              mainValue?: string | boolean | number | { identifier?: string; status?: boolean | null } | MechanicalMaintenanceValue | null;
              description?: string;
              actionBy?: string;
              completionDate?: string;
            };
            value = extendedValue.mainValue ?? null;
            // Get note from response.note (since description was removed)
            noteOrDescription = response.note || "";
            actionBy = extendedValue.actionBy || response.actionBy || "";
            completionDate = extendedValue.completionDate || response.completionDate || "";
          } else {
            // Old format - value is the actual value
            value = rawValue;
            noteOrDescription = response.note || "";
            actionBy = response.actionBy || "";
            completionDate = response.completionDate || "";
          }
        }
        
        if (value !== undefined && value !== null && value !== "") {
          switch (item.type) {
            case "mechanical-maintenance":
              // Handle mechanical maintenance checkboxes
              if (typeof value === "object" && value !== null) {
                const mechVal = value as MechanicalMaintenanceValue;
                const checked: string[] = [];
                if (mechVal.inspect) checked.push("✓INSPECT");
                if (mechVal.oil) checked.push("✓OIL");
                if (mechVal.clean) checked.push("✓CLEAN");
                if (mechVal.test) checked.push("✓TEST");
                if (mechVal.lube) checked.push("✓LUBE");
                if (mechVal.filter) checked.push("✓FILTER");
                displayValue = checked.length > 0 ? checked.join(" ") : "-";
                noteOrDescription = mechVal.comments || "";
              }
              break;
            case "ok-issue":
              // Handle boolean values (true = OK, false = Issue)
              if (value === true) {
                displayValue = "OK";
              } else if (value === false) {
                displayValue = "ISSUE";
                hasIssue = true;
              }
              break;
            case "pass-fail":
              if (value === true) {
                displayValue = "PASS";
              } else if (value === false) {
                displayValue = "FAIL";
                hasIssue = true;
              }
              break;
            case "on-off":
              if (typeof value === "boolean") {
                displayValue = value ? "ON" : "OFF";
              }
              break;
            case "open-closed":
              if (typeof value === "boolean") {
                displayValue = value ? "OPEN" : "CLOSED";
              }
              break;
            case "combined-toggle":
              if (typeof value === "object" && value !== null) {
                const combined = value as { identifier?: string; status?: boolean | null };
                const parts: string[] = [];
                if (combined.identifier) {
                  parts.push(`#${combined.identifier}`);
                }
                if (combined.status !== undefined && combined.status !== null) {
                  parts.push(combined.status ? "ON" : "OFF");
                }
                displayValue = parts.length > 0 ? parts.join(" - ") : "-";
              } else if (typeof value === "boolean") {
                displayValue = value ? "ON" : "OFF";
              }
              break;
            case "number":
              displayValue = `${value}${item.unit ? ` ${item.unit}` : ""}`;
              break;
            case "select":
              displayValue = String(value);
              break;
            case "text":
            case "textarea":
              displayValue = String(value);
              break;
            default:
              // For unknown types, only stringify primitives, not objects
              if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
                displayValue = String(value);
              }
          }
        }
      }
      
      // For extended fields forms, include description, action by, completion date
      if (hasExtendedHeader) {
        const row: (string | { content: string; styles: { fillColor: [number, number, number] } })[] = [
          item.label,
          hasIssue 
            ? { content: displayValue, styles: { fillColor: [255, 200, 200] as [number, number, number] } }
            : displayValue,
          noteOrDescription,
          actionBy,
          completionDate
        ];
        tableData.push(row);
      } else {
        const row: (string | { content: string; styles: { fillColor: [number, number, number] } })[] = [
          item.label,
          hasIssue 
            ? { content: displayValue, styles: { fillColor: [255, 200, 200] as [number, number, number] } }
            : displayValue,
          noteOrDescription
        ];
        tableData.push(row);
      }
    });
    
    // Generate table
    const tableHead = hasExtendedHeader 
      ? [["Item", "Status", "Notes", "Action By", "Completion Date"]]
      : [["Item", "Status", "Notes"]];
    
    const columnStyles = hasExtendedHeader
      ? {
          0: { cellWidth: 50 },
          1: { cellWidth: 25 },
          2: { cellWidth: "auto" },
          3: { cellWidth: 35 },
          4: { cellWidth: 35 },
        }
      : {
          0: { cellWidth: 80 },
          1: { cellWidth: 40 },
          2: { cellWidth: "auto" },
        };
    
    autoTable(doc, {
      startY: yPosition,
      head: tableHead,
      body: tableData,
      margin: { left: margin, right: margin },
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [80, 80, 80],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: columnStyles as any,
      didDrawPage: () => {
        // Footer on each page
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Page ${doc.getNumberOfPages()}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      },
    });
    
    yPosition = (doc as any).lastAutoTable.finalY + 10;
  };
  
  // Check if template has sections with items - use sections OR items, not both
  const hasSectionsWithItems = template.sections && template.sections.length > 0 && 
    template.sections.some(section => section.items && section.items.length > 0);
  
  if (hasSectionsWithItems) {
    // Use sections (preferred for forms with structured sections)
    template.sections!.forEach((section) => {
      if (section.items && section.items.length > 0) {
        generateItemsTable(section.items, section.title);
      }
    });
  } else if (template.items && template.items.length > 0) {
    // Fall back to direct items only if no sections with items exist
    generateItemsTable(template.items);
  }
  
  // Save the PDF
  const fileName = `${inspection.formName.replace(/\s+/g, "_")}_${format(completedDate, "yyyy-MM-dd")}.pdf`;
  doc.save(fileName);
}
