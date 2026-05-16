const { body, validationResult } = require('express-validator');

const leadValidationRules = [
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('companyName')
    .trim()
    .notEmpty()
    .withMessage('Company name is required'),
  body('website')
    .trim()
    .notEmpty()
    .withMessage('Website URL is required')
    .custom((value) => {
      // Allow URLs with or without protocol
      const urlPattern = /^(https?:\/\/)?[\w.-]+\.[a-z]{2,}(\/.*)?$/i;
      if (!urlPattern.test(value)) {
        throw new Error('Please provide a valid website URL');
      }
      return true;
    }),
  body('industry').optional().trim(),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: errors.array().map((e) => ({
          field: e.path,
          message: e.msg,
        })),
      },
    });
  }
  next();
};

module.exports = { leadValidationRules, validate };
