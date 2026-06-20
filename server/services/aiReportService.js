const { GoogleGenAI } = require('@google/genai');
const logger = require('../utils/logger');

let aiInstance = null;

function getAIClient() {
  if (!aiInstance) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiInstance;
}

const SYSTEM_PROMPT = `You are an elite business consultant and digital strategist. You produce highly personalized, insightful business audit reports. Your reports must feel custom-written for the specific company — never generic.

When writing, reference specific details from the company's website, industry context, and business model. Use a professional yet accessible tone.

Return your response as valid JSON with exactly this structure:
{
  "executiveSummary": "A 3-4 paragraph personalized overview of the company, their market position, and key observations.",
  "websiteAnalysis": "Detailed analysis of the company's website including design, content quality, messaging clarity, and overall effectiveness.",
  "seoAssessment": "Analysis of SEO factors: title tags, meta descriptions, heading structure, content optimization, and areas for improvement.",
  "uxReview": "User experience evaluation covering navigation, mobile responsiveness, page speed implications, call-to-actions, and conversion optimization.",
  "automationOpportunities": "Specific business process automation opportunities relevant to their industry and operations.",
  "aiIntegration": "Concrete AI integration possibilities specific to their business model and industry.",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3", "Recommendation 4", "Recommendation 5"],
  "seoScore": 72
}

The seoScore should be 0-100 based on your assessment of their current SEO posture.
The recommendations array should contain exactly 5 prioritized, actionable items.`;

async function generateWithModel(ai, modelName, prompt) {
  const response = await ai.models.generateContent({
    model: modelName,
    contents: prompt,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      temperature: 0.7,
    },
  });

  const content = response.text;
  return JSON.parse(content);
}

/**
 * Generates a personalized AI audit report using Gemini.
 * Includes multiple fallbacks in case the primary model is rate-limited or unavailable.
 */
async function generateReport(leadData, enrichmentData) {
  logger.info(`Generating AI report for ${leadData.companyName}...`);

  const userPrompt = buildPrompt(leadData, enrichmentData);
  const ai = getAIClient();

  // List of models to try in order of preference
  const modelsToTry = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-flash-latest'];

  for (let i = 0; i < modelsToTry.length; i++) {
    const model = modelsToTry[i];
    try {
      logger.info(`Attempting report generation with ${model}...`);
      const report = await generateWithModel(ai, model, userPrompt);
      logger.success(`AI report generated for ${leadData.companyName} using ${model}`);
      return report;
    } catch (error) {
      logger.warn(`${model} failed to generate report: ${error.message}`);
      
      // If it's the last model, throw the error
      if (i === modelsToTry.length - 1) {
        logger.error(`All models failed to generate AI report.`);
        throw error;
      }
      logger.info(`Retrying with next fallback model...`);
    }
  }
}

function buildPrompt(lead, enrichment) {
  let prompt = `Generate a comprehensive business audit report for the following company:\n\n`;
  prompt += `**Company Name:** ${lead.companyName}\n`;
  prompt += `**Contact:** ${lead.fullName} (${lead.email})\n`;
  prompt += `**Website:** ${lead.website}\n`;

  if (lead.industry) {
    prompt += `**Industry:** ${lead.industry}\n`;
  }

  if (enrichment && enrichment.success) {
    prompt += `\n--- WEBSITE DATA (scraped from their site) ---\n`;
    prompt += `**Page Title:** ${enrichment.title || 'Not found'}\n`;
    prompt += `**Meta Description:** ${enrichment.metaDescription || 'Not found'}\n`;

    if (enrichment.headings.h1.length > 0) {
      prompt += `**H1 Headings:** ${enrichment.headings.h1.join(', ')}\n`;
    }
    if (enrichment.headings.h2.length > 0) {
      prompt += `**H2 Headings:** ${enrichment.headings.h2.join(', ')}\n`;
    }

    prompt += `**Links on page:** ${enrichment.linksCount}\n`;
    prompt += `**Images on page:** ${enrichment.imagesCount}\n`;

    if (enrichment.technologies.length > 0) {
      prompt += `**Detected Technologies:** ${enrichment.technologies.join(', ')}\n`;
    }

    if (enrichment.bodyText) {
      prompt += `\n**Website Content (excerpt):**\n${enrichment.bodyText.slice(0, 2000)}\n`;
    }
  } else {
    prompt += `\nNote: Website scraping was unsuccessful. Generate the report based on the company name, industry, and any publicly known information. Make reasonable inferences.\n`;
  }

  prompt += `\nPlease generate a thorough, personalized audit. Reference specific details you observe. Do NOT be generic.`;

  return prompt;
}

module.exports = { generateReport };
