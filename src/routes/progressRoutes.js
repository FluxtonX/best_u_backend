const express = require('express');
const { 
  getProgressSummary, 
  logWeight, 
  getWeightHistory, 
  getPersonalBests,
  getStrengthLevels,
  syncHealthData
} = require('../controllers/progressController');
const verifyFirebaseToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyFirebaseToken);

const { check } = require('express-validator');
const validate = require('../utils/validation');

router.get('/summary', getProgressSummary);
router.post('/weight', logWeight);
router.get('/weight-history', getWeightHistory);
router.get('/personal-bests', getPersonalBests);
router.get('/strength-levels', getStrengthLevels);

// Health Sync (Google Fit / Apple Health)
router.post(
  '/sync-health',
  [
    check('source', 'Source is required').isIn(['Google Fit', 'Apple Health']),
    check('steps', 'Steps must be a number').optional().isNumeric(),
    check('date', 'Valid date is required').isISO8601(),
    validate,
  ],
  syncHealthData
);

module.exports = router;
