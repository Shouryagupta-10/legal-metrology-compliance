import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ComplianceReport } from '../types/compliance';

/**
 * Generates an official, publication-ready Legal Metrology Statutory Inspection Notice & Audit Report PDF.
 */
export function exportComplianceReportPDF(report: ComplianceReport): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Colors
  const primaryColor: [number, number, number] = [2, 132, 199]; // Sky 600
  const darkNavy: [number, number, number] = [15, 23, 42]; // Slate 900
  const passGreen: [number, number, number] = [16, 185, 129];
  const failRed: [number, number, number] = [239, 68, 68];
  const warnAmber: [number, number, number] = [245, 158, 11];

  // Header Banner
  doc.setFillColor(...darkNavy);
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent Stripe
  doc.setFillColor(...primaryColor);
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Header Titles
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('METROLOGYGUARD AI | LEGAL METROLOGY COMPLIANCE AUDIT', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(186, 230, 253);
  doc.text('Statutory Audit under Legal Metrology (Packaged Commodities) Rules, 2011 & Legal Metrology Act, 2009', 14, 18);
  doc.text(`Ref ID: ${report.inspectionId} | Date: ${report.inspectionDate} | Standard: LMPC 2011 + 2021 USP Amendment`, 14, 23);

  // Status Badge on Top Right
  const statusColor = report.overallStatus === 'COMPLIANT' ? passGreen : failRed;
  doc.setFillColor(...statusColor);
  doc.roundedRect(pageWidth - 60, 8, 46, 14, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text(report.overallStatus.replace('_', ' '), pageWidth - 37, 17, { align: 'center' });

  let currentY = 38;

  // Product & Entity Overview Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, currentY, pageWidth - 28, 42, 2, 2, 'FD');

  doc.setTextColor(...darkNavy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('1. AUDITED COMMODITY & ENTITY PARTICULARS', 18, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(51, 65, 85);

  const col1X = 18;
  const col2X = pageWidth / 2 + 5;

  doc.text(`Commodity Name: ${report.productName}`, col1X, currentY + 14);
  doc.text(`Brand Name: ${report.brandName}`, col1X, currentY + 20);
  doc.text(`Category: ${report.categoryName} | SKU: ${report.productSku || 'N/A'}`, col1X, currentY + 26);
  doc.text(`Net Quantity: ${report.declarations.netQuantityValue || 'N/A'} ${report.declarations.netQuantityUnit || ''}`, col1X, currentY + 32);
  doc.text(`Declared MRP: ₹ ${report.declarations.mrpValue || 'N/A'} (${report.declarations.isTaxesInclusiveDeclared ? 'incl. taxes' : 'MISSING TAX NOTE'})`, col1X, currentY + 38);

  doc.text(`Manufacturer/Packer: ${report.declarations.manufacturerName || 'NOT DECLARED'}`, col2X, currentY + 14);
  doc.text(`Address: ${(report.declarations.manufacturerAddress || 'N/A').substring(0, 45)}...`, col2X, currentY + 20);
  doc.text(`PIN Code: ${report.declarations.manufacturerPin || 'MISSING'} | State: ${report.declarations.manufacturerState || 'N/A'}`, col2X, currentY + 26);
  doc.text(`Country of Origin: ${report.declarations.countryOfOrigin || 'NOT DECLARED'}`, col2X, currentY + 32);
  doc.text(`Consumer Care Email: ${report.declarations.consumerCareEmail || 'MISSING'}`, col2X, currentY + 38);

  currentY += 48;

  // Compliance Metrics Cards
  const cardW = (pageWidth - 28 - 12) / 4;
  const cardH = 18;

  const metrics = [
    { label: 'COMPLIANCE SCORE', val: `${report.overallScore}%`, color: report.overallScore >= 80 ? passGreen : failRed },
    { label: 'RULES CHECKED', val: `${report.totalRulesChecked}`, color: primaryColor },
    { label: 'PASSED RULES', val: `${report.passedRulesCount}`, color: passGreen },
    { label: 'VIOLATIONS DETECTED', val: `${report.failedRulesCount}`, color: report.failedRulesCount > 0 ? failRed : passGreen }
  ];

  metrics.forEach((m, idx) => {
    const cardX = 14 + idx * (cardW + 4);
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(cardX, currentY, cardW, cardH, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, cardX + cardW / 2, currentY + 6, { align: 'center' });
    doc.setFontSize(13);
    doc.setTextColor(...m.color);
    doc.text(m.val, cardX + cardW / 2, currentY + 14, { align: 'center' });
  });

  currentY += 24;

  // Section 2: Statutory Findings Table
  doc.setTextColor(...darkNavy);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('2. STATUTORY RULE-BY-RULE COMPLIANCE AUDIT MATRIX', 14, currentY);
  currentY += 4;

  const tableRows = report.ruleResults.map(r => {
    const statusText = r.status === 'PASS' ? 'COMPLIANT' : r.status === 'FAIL' ? 'VIOLATION' : r.status === 'WARNING' ? 'WARNING' : 'N/A';
    const notes = r.status === 'FAIL'
      ? `${r.deficiencyReason || ''}\nRecommendation: ${r.recommendation || ''}`
      : r.description;

    return [
      r.ruleCode,
      r.ruleTitle,
      r.extractedValue || 'None',
      statusText,
      r.legalCitation,
      notes
    ];
  });

  autoTable(doc, {
    startY: currentY,
    head: [['Rule Code', 'Declaration Parameter', 'Extracted Value', 'Status', 'Statutory Clause', 'Findings & Corrective Action']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: darkNavy,
      textColor: 255,
      fontSize: 7.5,
      fontStyle: 'bold',
      halign: 'left'
    },
    styles: {
      fontSize: 7,
      cellPadding: 2,
      overflow: 'linebreak'
    },
    columnStyles: {
      0: { cellWidth: 22, fontStyle: 'bold' },
      1: { cellWidth: 32 },
      2: { cellWidth: 28 },
      3: { cellWidth: 20, fontStyle: 'bold', halign: 'center' },
      4: { cellWidth: 30 },
      5: { cellWidth: 50 }
    },
    didParseCell: (data) => {
      if (data.section === 'body' && data.column.index === 3) {
        if (data.cell.raw === 'COMPLIANT') {
          data.cell.styles.textColor = passGreen;
        } else if (data.cell.raw === 'VIOLATION') {
          data.cell.styles.textColor = failRed;
        } else if (data.cell.raw === 'WARNING') {
          data.cell.styles.textColor = warnAmber;
        }
      }
    }
  });

  // Get final Y from table
  // @ts-ignore
  let finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 8 : currentY + 90;

  if (finalY > pageHeight - 65) {
    doc.addPage();
    finalY = 20;
  }

  // Section 3: Legal Liability & Penalty Assessment
  doc.setFillColor(254, 242, 242);
  doc.setDrawColor(252, 165, 165);
  doc.roundedRect(14, finalY, pageWidth - 28, 28, 2, 2, 'FD');

  doc.setTextColor(153, 27, 27);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('3. STATUTORY PENALTY & LEGAL LIABILITY (SECTION 36 OF LEGAL METROLOGY ACT, 2009)', 18, finalY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(127, 29, 29);
  doc.text(`• First Offence Fine: Up to ₹ 25,000/- per non-compliant packaging parameter.`, 18, finalY + 13);
  doc.text(`• Second Offence Fine: Up to ₹ 50,000/-. Subsequent Offences: Fine up to ₹ 1,00,000/- or Imprisonment up to 1 Year.`, 18, finalY + 18);
  doc.text(`• Statutory Notice: Manufacturer/Packer/Seller is liable to be issued notice under Rule 6 of LMPC Rules, 2011.`, 18, finalY + 23);

  finalY += 34;

  if (finalY > pageHeight - 35) {
    doc.addPage();
    finalY = 20;
  }

  // Signatures and Seal
  doc.setDrawColor(203, 213, 225);
  doc.line(14, finalY + 18, 70, finalY + 18);
  doc.line(pageWidth - 70, finalY + 18, pageWidth - 14, finalY + 18);

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(8);
  doc.text('Authorized Compliance Inspector', 14, finalY + 23);
  doc.text('Official Seal / Digital Signature', pageWidth - 70, finalY + 23);

  // Download PDF
  const filename = `Legal_Metrology_Audit_${report.productName.replace(/[^a-zA-Z0-9]/g, '_')}_${report.inspectionId}.pdf`;
  doc.save(filename);
}
