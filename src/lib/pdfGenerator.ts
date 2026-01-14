import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
import { CompletedInspection } from "./inspectionsStore";
import { getFormTemplate, FormTemplate } from "./formTemplates";

// Mock inspection data for PDF - in real app this would come from stored responses
interface InspectionData {
  operatorName: string;
  responses: Record<string, { value: string | boolean; note?: string }>;
}

// Generate mock data for demonstration
function generateMockInspectionData(template: FormTemplate): InspectionData {
  const responses: Record<string, { value: string | boolean; note?: string }> = {};
  
  template.sections.forEach(section => {
    section.items.forEach(item => {
      switch (item.type) {
        case "ok-issue":
          responses[item.id] = { value: Math.random() > 0.1 ? "ok" : "issue" };
          break;
        case "pass-fail":
          responses[item.id] = { value: Math.random() > 0.1 ? "pass" : "fail" };
          break;
        case "on-off":
          responses[item.id] = { value: Math.random() > 0.2 };
          break;
        case "open-closed":
          responses[item.id] = { value: Math.random() > 0.3 };
          break;
        case "number":
          const baseValue = item.unit === "°C" ? 20 + Math.random() * 30 : 50 + Math.random() * 100;
          responses[item.id] = { value: baseValue.toFixed(1) };
          break;
        case "select":
          const options = item.selectOptions || ["1/4", "2/4", "3/4"];
          responses[item.id] = { value: options[Math.floor(Math.random() * options.length)] };
          break;
        case "combined-toggle":
          responses[item.id] = { value: Math.random() > 0.1 };
          break;
        case "text":
        case "textarea":
          responses[item.id] = { value: "" };
          break;
      }
    });
  });
  
  return {
    operatorName: "John Smith",
    responses
  };
}

export function generateInspectionPDF(inspection: CompletedInspection): void {
  const template = getFormTemplate(inspection.formId);
  
  if (!template) {
    console.error("Template not found for:", inspection.formId);
    return;
  }
  
  const inspectionData = generateMockInspectionData(template);
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
  doc.text(`OPERATOR: ${inspectionData.operatorName}`, margin, 30);
  doc.text(`DATE: ${format(completedDate, "MMMM d, yyyy")}`, margin, 36);
  doc.text(`TIME: ${format(completedDate, "h:mm a")}`, margin, 42);
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
  template.sections.forEach((section, sectionIndex) => {
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
      const response = inspectionData.responses[item.id];
      let displayValue = "-";
      let hasIssue = false;
      
      if (response) {
        switch (item.type) {
          case "ok-issue":
            displayValue = response.value === "ok" ? "✓ OK" : "✗ ISSUE";
            hasIssue = response.value === "issue";
            break;
          case "pass-fail":
            displayValue = response.value === "pass" ? "✓ PASS" : "✗ FAIL";
            hasIssue = response.value === "fail";
            break;
          case "on-off":
            displayValue = response.value ? "ON" : "OFF";
            break;
          case "open-closed":
            displayValue = response.value ? "OPEN" : "CLOSED";
            break;
          case "combined-toggle":
            displayValue = response.value ? "ON" : "OFF";
            break;
          case "number":
            displayValue = `${response.value}${item.unit ? ` ${item.unit}` : ""}`;
            break;
          case "select":
            displayValue = String(response.value);
            break;
          default:
            displayValue = String(response.value || "-");
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
      head: [["Item", "Value", "Notes"]],
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
      didDrawPage: (data) => {
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
