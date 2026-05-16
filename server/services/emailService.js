const nodemailer = require('nodemailer');
const logger = require('../utils/logger');
const { buildEmailHTML } = require('../templates/emailTemplate');

let transporter = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return transporter;
}

/**
 * Sends the audit report PDF to the lead's email.
 */
async function sendReportEmail(leadData, pdfPath) {
  logger.info(`Sending email to ${leadData.email}...`);

  const html = buildEmailHTML({
    name: leadData.fullName,
    companyName: leadData.companyName,
  });

  const mailOptions = {
    from: `"LeadAudit AI" <${process.env.SMTP_USER}>`,
    to: leadData.email,
    subject: `Your Business Audit Report — ${leadData.companyName}`,
    html,
    attachments: [
      {
        filename: `${leadData.companyName.replace(/[^a-zA-Z0-9]/g, '-')}-Audit-Report.pdf`,
        path: pdfPath,
        contentType: 'application/pdf',
      },
    ],
  };

  try {
    const info = await getTransporter().sendMail(mailOptions);
    logger.success(`Email sent to ${leadData.email} (ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    logger.error(`Email failed for ${leadData.email}: ${error.message}`);
    return { success: false, error: error.message };
  }
}

module.exports = { sendReportEmail };
