const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

// Color palette
const COLORS = {
  primary: '#1a56db',
  primaryLight: '#3b82f6',
  dark: '#111827',
  text: '#374151',
  textLight: '#6b7280',
  accent: '#0ea5e9',
  white: '#ffffff',
  bgLight: '#f9fafb',
  border: '#e5e7eb',
  success: '#059669',
  warning: '#d97706',
};

const REPORTS_DIR = path.join(__dirname, '..', 'reports');

/**
 * Generates a professional PDF audit report.
 * Returns the absolute file path of the generated PDF.
 */
async function generatePDF(leadData, auditReport) {
  // Ensure reports directory exists
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }

  const fileName = `audit-${leadData._id}-${Date.now()}.pdf`;
  const filePath = path.join(REPORTS_DIR, fileName);

  logger.info(`Generating PDF: ${fileName}`);

  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: `Business Audit Report - ${leadData.companyName}`,
          Author: 'LeadAudit AI',
          Subject: 'AI-Powered Business Audit',
        },
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // --- Cover Page ---
      drawCoverPage(doc, leadData);

      // --- Content Pages ---
      const sections = [
        { title: 'Executive Summary', content: auditReport.executiveSummary },
        { title: 'Website Analysis', content: auditReport.websiteAnalysis },
        { title: 'SEO Assessment', content: auditReport.seoAssessment, score: auditReport.seoScore },
        { title: 'UX & Design Review', content: auditReport.uxReview },
        { title: 'Automation Opportunities', content: auditReport.automationOpportunities },
        { title: 'AI Integration Potential', content: auditReport.aiIntegration },
      ];

      sections.forEach((section) => {
        doc.addPage();
        drawSectionPage(doc, section);
      });

      // Recommendations page
      doc.addPage();
      drawRecommendationsPage(doc, auditReport.recommendations);

      // Footer on all content pages
      const pageCount = doc.bufferedPageRange();
      for (let i = 1; i < pageCount.start + pageCount.count; i++) {
        doc.switchToPage(i);
        drawFooter(doc, i + 1, pageCount.count + 1);
      }

      doc.end();

      stream.on('finish', () => {
        logger.success(`PDF generated: ${filePath}`);
        resolve(filePath);
      });

      stream.on('error', reject);
    } catch (error) {
      reject(error);
    }
  });
}

function drawCoverPage(doc, lead) {
  // Background
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(COLORS.dark);

  // Accent bar at top
  const gradient = doc.linearGradient(0, 0, doc.page.width, 0);
  gradient.stop(0, COLORS.primary).stop(1, COLORS.accent);
  doc.rect(0, 0, doc.page.width, 6).fill(gradient);

  // Brand name
  doc.fillColor(COLORS.primaryLight).fontSize(14).font('Helvetica').text('LeadAudit AI', 50, 60);

  // Main title
  doc
    .fillColor(COLORS.white)
    .fontSize(38)
    .font('Helvetica-Bold')
    .text('Business Audit', 50, 220, { width: 495 });

  doc.fontSize(38).text('Report', 50, 268, { width: 495 });

  // Divider line
  doc.rect(50, 330, 80, 4).fill(COLORS.primaryLight);

  // Company name
  doc
    .fillColor(COLORS.white)
    .fontSize(22)
    .font('Helvetica')
    .text(lead.companyName, 50, 360, { width: 495 });

  // Details
  doc.fillColor('#9ca3af').fontSize(12).font('Helvetica');
  doc.text(`Prepared for: ${lead.fullName}`, 50, 420);
  doc.text(`Email: ${lead.email}`, 50, 440);
  doc.text(`Website: ${lead.website}`, 50, 460);
  if (lead.industry) {
    doc.text(`Industry: ${lead.industry}`, 50, 480);
  }

  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  doc.text(`Date: ${date}`, 50, lead.industry ? 500 : 480);

  // Bottom disclaimer
  doc
    .fillColor('#6b7280')
    .fontSize(9)
    .text(
      'This report was generated using AI-powered analysis. Recommendations should be reviewed by qualified professionals.',
      50,
      doc.page.height - 80,
      { width: 495, align: 'center' }
    );
}

function drawSectionPage(doc, section) {
  // Section header bar
  const gradient = doc.linearGradient(0, 0, doc.page.width, 0);
  gradient.stop(0, COLORS.primary).stop(1, COLORS.accent);
  doc.rect(0, 0, doc.page.width, 4).fill(gradient);

  // Section title
  doc
    .fillColor(COLORS.dark)
    .fontSize(24)
    .font('Helvetica-Bold')
    .text(section.title, 50, 50, { width: 495 });

  // Underline
  doc.rect(50, 82, 60, 3).fill(COLORS.primaryLight);

  // SEO score badge (if applicable)
  let contentY = 100;
  if (section.score !== undefined) {
    contentY = drawScoreBadge(doc, section.score, 100);
  }

  // Section content
  doc
    .fillColor(COLORS.text)
    .fontSize(11)
    .font('Helvetica')
    .text(section.content || 'No data available for this section.', 50, contentY, {
      width: 495,
      lineGap: 5,
      paragraphGap: 10,
    });
}

function drawScoreBadge(doc, score, y) {
  const color = score >= 70 ? COLORS.success : score >= 40 ? COLORS.warning : '#dc2626';

  doc.roundedRect(50, y, 120, 50, 8).fill('#f3f4f6');
  doc.fillColor(color).fontSize(28).font('Helvetica-Bold').text(`${score}`, 60, y + 8, { width: 50 });
  doc
    .fillColor(COLORS.textLight)
    .fontSize(9)
    .font('Helvetica')
    .text('/100', 105, y + 18);
  doc.text('SEO Score', 60, y + 38, { width: 100 });

  return y + 70;
}

function drawRecommendationsPage(doc, recommendations) {
  // Header bar
  const gradient = doc.linearGradient(0, 0, doc.page.width, 0);
  gradient.stop(0, COLORS.primary).stop(1, COLORS.accent);
  doc.rect(0, 0, doc.page.width, 4).fill(gradient);

  doc
    .fillColor(COLORS.dark)
    .fontSize(24)
    .font('Helvetica-Bold')
    .text('Priority Recommendations', 50, 50, { width: 495 });

  doc.rect(50, 82, 60, 3).fill(COLORS.primaryLight);

  let yPos = 100;
  const items = recommendations || [];

  items.forEach((rec, index) => {
    if (yPos > 700) {
      doc.addPage();
      yPos = 50;
    }

    // Number circle
    doc.circle(65, yPos + 10, 14).fill(COLORS.primary);
    doc
      .fillColor(COLORS.white)
      .fontSize(12)
      .font('Helvetica-Bold')
      .text(`${index + 1}`, 57, yPos + 4, { width: 16, align: 'center' });

    // Recommendation text
    doc
      .fillColor(COLORS.text)
      .fontSize(11)
      .font('Helvetica')
      .text(rec, 90, yPos, { width: 455, lineGap: 4 });

    const textHeight = doc.heightOfString(rec, { width: 455, lineGap: 4 });
    yPos += Math.max(textHeight, 28) + 20;
  });
}

function drawFooter(doc, pageNum, totalPages) {
  const y = doc.page.height - 35;
  doc
    .fillColor(COLORS.textLight)
    .fontSize(8)
    .font('Helvetica')
    .text(`LeadAudit AI — Confidential`, 50, y, { width: 200 });
  doc.text(`Page ${pageNum} of ${totalPages}`, 300, y, {
    width: 245,
    align: 'right',
  });
}

module.exports = { generatePDF };
