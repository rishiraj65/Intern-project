const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    companyName: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    website: {
      type: String,
      required: [true, 'Website URL is required'],
      trim: true,
    },
    industry: {
      type: String,
      trim: true,
      default: '',
    },
    enrichmentData: {
      title: String,
      metaDescription: String,
      ogTags: mongoose.Schema.Types.Mixed,
      headings: {
        h1: [String],
        h2: [String],
        h3: [String],
      },
      bodyText: String,
      linksCount: Number,
      imagesCount: Number,
      technologies: [String],
      success: Boolean,
      error: String,
    },
    auditReport: {
      executiveSummary: String,
      websiteAnalysis: String,
      seoAssessment: String,
      uxReview: String,
      automationOpportunities: String,
      aiIntegration: String,
      recommendations: [String],
      seoScore: Number,
    },
    pdfPath: {
      type: String,
      default: null,
    },
    emailStatus: {
      type: String,
      enum: ['pending', 'sent', 'failed'],
      default: 'pending',
    },
    status: {
      type: String,
      enum: [
        'received',
        'enriching',
        'generating',
        'creating_pdf',
        'emailing',
        'completed',
        'failed',
      ],
      default: 'received',
    },
    errorMessage: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Lead', leadSchema);
