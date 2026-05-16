const express = require('express');
const router = express.Router();
const { leadValidationRules, validate } = require('../middleware/validateLead');
const leadController = require('../controllers/leadController');

router.post('/', leadValidationRules, validate, leadController.submitLead);
router.get('/', leadController.getAllLeads);
router.get('/:id', leadController.getLeadById);
router.get('/:id/status', leadController.getLeadStatus);

module.exports = router;
