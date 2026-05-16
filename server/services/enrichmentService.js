const axios = require('axios');
const cheerio = require('cheerio');
const logger = require('../utils/logger');

/**
 * Scrapes and enriches company data from their website.
 * Extracts metadata, headings, body text, and technology signals.
 */
async function enrichCompany(websiteUrl) {
  const result = {
    url: websiteUrl,
    title: null,
    metaDescription: null,
    ogTags: {},
    headings: { h1: [], h2: [], h3: [] },
    bodyText: '',
    linksCount: 0,
    imagesCount: 0,
    technologies: [],
    success: false,
    error: null,
  };

  try {
    // Normalize URL — add protocol if missing
    let url = websiteUrl.trim();
    if (!/^https?:\/\//i.test(url)) {
      url = `https://${url}`;
    }

    logger.info(`Scraping website: ${url}`);

    const { data: html } = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      maxRedirects: 5,
    });

    const $ = cheerio.load(html);

    // Page title
    result.title = $('title').text().trim() || null;

    // Meta description — try standard, then OG
    result.metaDescription =
      $('meta[name="description"]').attr('content') ||
      $('meta[property="og:description"]').attr('content') ||
      null;

    // Open Graph tags
    $('meta[property^="og:"]').each((_, el) => {
      const property = $(el).attr('property')?.replace('og:', '');
      if (property) {
        result.ogTags[property] = $(el).attr('content') || '';
      }
    });

    // Headings
    $('h1').each((_, el) => {
      const text = $(el).text().trim();
      if (text) result.headings.h1.push(text);
    });
    $('h2').each((_, el) => {
      const text = $(el).text().trim();
      if (text) result.headings.h2.push(text.slice(0, 200));
    });
    $('h3').each((_, el) => {
      const text = $(el).text().trim();
      if (text) result.headings.h3.push(text.slice(0, 200));
    });

    // Limit heading arrays
    result.headings.h1 = result.headings.h1.slice(0, 5);
    result.headings.h2 = result.headings.h2.slice(0, 10);
    result.headings.h3 = result.headings.h3.slice(0, 10);

    // Clean body text
    $('script, style, nav, footer, header, noscript, iframe').remove();
    result.bodyText = $('body')
      .text()
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 3000);

    // Link and image counts
    result.linksCount = $('a[href]').length;
    result.imagesCount = $('img').length;

    // Technology detection
    const generator = $('meta[name="generator"]').attr('content');
    if (generator) result.technologies.push(generator);

    const techSignals = [
      { pattern: 'wp-content', name: 'WordPress' },
      { pattern: 'Shopify', name: 'Shopify' },
      { pattern: 'Squarespace', name: 'Squarespace' },
      { pattern: 'Wix', name: 'Wix' },
      { pattern: '__next', name: 'Next.js' },
      { pattern: 'gatsby', name: 'Gatsby' },
      { pattern: 'nuxt', name: 'Nuxt.js' },
    ];

    for (const { pattern, name } of techSignals) {
      if (html.includes(pattern) && !result.technologies.includes(name)) {
        result.technologies.push(name);
      }
    }

    result.success = true;
    logger.success(`Enrichment complete for ${url}`);
  } catch (error) {
    result.error = error.message;
    result.success = false;
    logger.warn(`Enrichment failed for ${websiteUrl}: ${error.message}`);
  }

  return result;
}

module.exports = { enrichCompany };
