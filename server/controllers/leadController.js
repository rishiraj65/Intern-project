const Lead = require('../models/Lead');
const { enrichCompany } = require('../services/enrichmentService');
const { generateReport } = require('../services/aiReportService');
const { generatePDF } = require('../services/pdfService');
const { sendReportEmail } = require('../services/emailService');
const logger = require('../utils/logger');

/**
 * Runs the full enrichment pipeline asynchronously.
 * Updates lead status at each stage so the frontend can poll progress.
 */
async function processLeadPipeline(leadId) {
  try {
    const lead = await Lead.findById(leadId);
    if (!lead) throw new Error('Lead not found');

    // Step 1: Enrich company data
    await Lead.findByIdAndUpdate(leadId, { status: 'enriching' });
    const enrichmentData = await enrichCompany(lead.website);
    await Lead.findByIdAndUpdate(leadId, { enrichmentData });

    // Step 2: Generate AI report
    await Lead.findByIdAndUpdate(leadId, { status: 'generating' });
    const auditReport = await generateReport(lead.toObject(), enrichmentData);
    await Lead.findByIdAndUpdate(leadId, { auditReport });

    // Step 3: Generate PDF
    await Lead.findByIdAndUpdate(leadId, { status: 'creating_pdf' });
    const updatedLead = await Lead.findById(leadId);
    const pdfPath = await generatePDF(updatedLead.toObject(), auditReport);
    await Lead.findByIdAndUpdate(leadId, { pdfPath });

    // Step 4: Send email
    await Lead.findByIdAndUpdate(leadId, { status: 'emailing' });
    const emailResult = await sendReportEmail(updatedLead.toObject(), pdfPath);
    await Lead.findByIdAndUpdate(leadId, {
      emailStatus: emailResult.success ? 'sent' : 'failed',
      status: 'completed',
    });

    logger.success(`Pipeline completed for lead ${leadId}`);
  } catch (error) {
    logger.error(`Pipeline failed for lead ${leadId}: ${error.message}`);
    await Lead.findByIdAndUpdate(leadId, {
      status: 'failed',
      errorMessage: error.message,
    });
  }
}

/**
 * POST /api/leads — Submit a new lead and start the pipeline.
 */
exports.submitLead = async (req, res, next) => {
  try {
    const { fullName, email, companyName, website, industry } = req.body;

    const lead = await Lead.create({
      fullName,
      email,
      companyName,
      website,
      industry: industry || '',
      status: 'received',
    });

    // Respond immediately, pipeline runs in background
    res.status(201).json({
      success: true,
      data: {
        leadId: lead._id,
        message: 'Lead submitted successfully. Processing has started.',
      },
    });

    // Fire and forget — pipeline runs asynchronously
    processLeadPipeline(lead._id).catch((err) => {
      logger.error(`Unhandled pipeline error: ${err.message}`);
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/leads/:id/status — Poll the processing status.
 */
exports.getLeadStatus = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id).select('status emailStatus errorMessage');
    if (!lead) {
      return res.status(404).json({ success: false, error: { message: 'Lead not found' } });
    }

    const stepMap = {
      received: { step: 0, label: 'Validating submission...' },
      enriching: { step: 1, label: 'Analyzing company website...' },
      generating: { step: 2, label: 'Generating AI audit report...' },
      creating_pdf: { step: 3, label: 'Creating PDF report...' },
      emailing: { step: 4, label: 'Sending report to your email...' },
      completed: { step: 5, label: 'Report delivered successfully!' },
      failed: { step: -1, label: 'An error occurred during processing.' },
    };

    const current = stepMap[lead.status] || stepMap.received;

    res.json({
      success: true,
      data: {
        status: lead.status,
        currentStep: current.step,
        message: current.label,
        emailStatus: lead.emailStatus,
        error: lead.errorMessage,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/leads/:id — Get full lead details.
 */
exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ success: false, error: { message: 'Lead not found' } });
    }
    res.json({ success: true, data: lead });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/leads — List all leads (admin/debug).
 */
exports.getAllLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find()
      .select('fullName email companyName status emailStatus createdAt')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, data: { leads, count: leads.length } });
  } catch (error) {
    next(error);
  }
};
