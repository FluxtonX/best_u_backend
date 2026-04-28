const express = require('express');
const { 
  getProgressSummary, 
  logWeight, 
  getWeightHistory, 
  getPersonalBests,
  getStrengthLevels 
} = require('../controllers/progressController');
const verifyFirebaseToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyFirebaseToken);

router.get('/summary', getProgressSummary);
router.post('/weight', logWeight);
router.get('/weight-history', getWeightHistory);
router.get('/personal-bests', getPersonalBests);
router.get('/strength-levels', getStrengthLevels);

module.exports = router;
