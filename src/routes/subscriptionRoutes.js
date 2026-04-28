const express = require('express');
const { getSubscriptionStatus } = require('../controllers/subscriptionController');
const verifyFirebaseToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyFirebaseToken);

router.get('/status', getSubscriptionStatus);

module.exports = router;
