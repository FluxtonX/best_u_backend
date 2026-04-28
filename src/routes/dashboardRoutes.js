const express = require('express');
const { getDashboardSummary, getDailyQuote } = require('../controllers/dashboardController');
const verifyFirebaseToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyFirebaseToken);

router.get('/summary', getDashboardSummary);
router.get('/quotes/daily', getDailyQuote);

module.exports = router;
