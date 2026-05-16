/**
 * Builds a professional HTML email template for the audit report delivery.
 */
function buildEmailHTML({ name, companyName }) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a56db,#0ea5e9);padding:32px 40px;">
              <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">LeadAudit AI</h1>
              <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:13px;">AI-Powered Business Intelligence</p>
            </td>
          </tr>
          
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <h2 style="color:#111827;font-size:20px;margin:0 0 16px;">Hi ${name},</h2>
              <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
                Your personalized business audit report for <strong>${companyName}</strong> is ready! 
                We've analyzed your company's website, online presence, and industry positioning 
                to provide you with actionable insights.
              </p>
              <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 24px;">
                Please find your comprehensive audit report attached to this email as a PDF document.
              </p>
              
              <!-- Highlights -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f7ff;border-radius:8px;padding:20px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="color:#1a56db;font-weight:600;font-size:14px;margin:0 0 12px;">Your report includes:</p>
                    <p style="color:#374151;font-size:13px;line-height:1.8;margin:0;">
                      ✅ Executive business summary<br>
                      ✅ Website & SEO analysis<br>
                      ✅ UX improvement suggestions<br>
                      ✅ Automation opportunities<br>
                      ✅ AI integration recommendations<br>
                      ✅ Prioritized action items
                    </p>
                  </td>
                </tr>
              </table>
              
              <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0;">
                This report was generated using advanced AI analysis. For best results, 
                we recommend reviewing the findings with your team and consulting with 
                relevant professionals for implementation.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color:#f9fafb;padding:24px 40px;border-top:1px solid #e5e7eb;">
              <p style="color:#9ca3af;font-size:12px;margin:0;text-align:center;">
                &copy; ${new Date().getFullYear()} LeadAudit AI. This is an automated message.<br>
                Generated with AI-powered analysis technology.
              </p>
            </td>
          </tr>
          
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

module.exports = { buildEmailHTML };
