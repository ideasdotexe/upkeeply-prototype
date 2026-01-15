import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { CompletedInspection, InspectionResponse } from "./inspectionsStore";
import { getFormTemplate } from "./formTemplates";

export function generateInspectionPDF(inspection: CompletedInspection): void {
  const template = getFormTemplate(inspection.formId);
  
  if (!template) {
    console.error("Template not found for:", inspection.formId);
    return;
  }
  
  // Use actual stored responses, or empty object if none
  const responses = inspection.responses || {};
  const completedDate = new Date(inspection.completedAt);
  
  // Create PDF in landscape mode
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4"
  });
  
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  
  // Header - use template name
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(template.name.toUpperCase(), pageWidth / 2, 20, { align: "center" });
  
  // Sub-header info
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`DATE: ${format(completedDate, "MMMM d, yyyy")}`, margin, 30);
  doc.text(`TIME: ${format(completedDate, "h:mm a")}`, margin, 36);
  doc.text(`STATUS: ${inspection.status === "completed" ? "COMPLETED" : "ISSUES FOUND"}`, pageWidth - margin - 50, 30);
  doc.text(`ITEMS: ${inspection.itemsCount}`, pageWidth - margin - 50, 36);
  if (inspection.issuesCount) {
    doc.text(`ISSUES: ${inspection.issuesCount}`, pageWidth - margin - 50, 42);
  }
  
  // Line separator
  doc.setLineWidth(0.5);
  doc.line(margin, 48, pageWidth - margin, 48);
  
  let yPosition = 55;
  
  // Iterate through sections
  template.sections.forEach((section) => {
    // Check if we need a new page
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Section header
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPosition - 5, pageWidth - margin * 2, 8, "F");
    doc.text(section.title, margin + 3, yPosition);
    yPosition += 10;
    
    // Prepare table data for section
    const tableData: (string | { content: string; styles: { fillColor?: [number, number, number] } })[][] = [];
    
    section.items.forEach(item => {
      const response = responses[item.id] as InspectionResponse | undefined;
      let displayValue = "-"; // Empty/not filled shows as dash
      let hasIssue = false;
      
      if (response && response.value !== undefined && response.value !== null && response.value !== "") {
        const value = response.value;
        
        switch (item.type) {
          case "ok-issue":
            if (value === "ok") {
              displayValue = "✓ OK";
            } else if (value === "issue") {
              displayValue = "✗ ISSUE";
              hasIssue = true;
            }
            break;
          case "pass-fail":
            if (value === "pass") {
              displayValue = "✓ PASS";
            } else if (value === "fail") {
              displayValue = "✗ FAIL";
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
            displayValue = String(value);
        }
      }
      
      const row: (string | { content: string; styles: { fillColor: [number, number, number] } })[] = [
        item.label,
        hasIssue 
          ? { content: displayValue, styles: { fillColor: [255, 200, 200] as [number, number, number] } }
          : displayValue,
        response?.note || ""
      ];
      tableData.push(row);
    });
    
    // Generate table for section
    autoTable(doc, {
      startY: yPosition,
      head: [["Item", "Status", "Notes"]],
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
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 40 },
        2: { cellWidth: "auto" },
      },
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
  });
  
  // Footer with signature line
  if (yPosition < pageHeight - 30) {
    yPosition = pageHeight - 30;
    doc.setLineWidth(0.3);
    doc.line(margin, yPosition, margin + 60, yPosition);
    doc.setFontSize(9);
    doc.text("Operator Signature", margin, yPosition + 5);
    
    doc.line(pageWidth - margin - 60, yPosition, pageWidth - margin, yPosition);
    doc.text("Date", pageWidth - margin - 60, yPosition + 5);
  }
  
  // Save the PDF
  const fileName = `${inspection.formName.replace(/\s+/g, "_")}_${format(completedDate, "yyyy-MM-dd")}.pdf`;
  doc.save(fileName);
}