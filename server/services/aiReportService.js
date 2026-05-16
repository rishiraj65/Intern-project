const OpenAI = require('openai');
const logger = require('../utils/logger');

let openaiInstance = null;

function getOpenAIClient() {
  if (!openaiInstance) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is missing.');
    }
    openaiInstance = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiInstance;
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

/**
 * Generates a personalized AI audit report using OpenAI.
 */
async function generateReport(leadData, enrichmentData) {
  logger.info(`Generating AI report for ${leadData.companyName}...`);

  const userPrompt = buildPrompt(leadData, enrichmentData);

  try {
    const client = getOpenAIClient();
    const completion = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = completion.choices[0].message.content;
    const report = JSON.parse(content);

    logger.success(`AI report generated for ${leadData.companyName}`);
    return report;
  } catch (error) {
    // Fallback to gpt-3.5-turbo if gpt-4o fails
    if (error.code === 'model_not_found' || error.status === 404) {
      logger.warn('gpt-4o not available, falling back to gpt-3.5-turbo');
      return generateWithFallback(userPrompt);
    }
    throw error;
  }
}

async function generateWithFallback(userPrompt) {
  const client = getOpenAIClient();
  const completion = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    response_format: { type: 'json_object' },
    temperature: 0.7,
    max_tokens: 4000,
  });

  return JSON.parse(completion.choices[0].message.content);
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
