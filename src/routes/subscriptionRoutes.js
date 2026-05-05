const express = require('express');
const { getSubscriptionStatus, createCheckoutSession, handleWebhook, createPortalSession } = require('../controllers/subscriptionController');
const verifyFirebaseToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Webhook route (No auth, signature verification happens in controller)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

router.use(verifyFirebaseToken);

router.get('/status', getSubscriptionStatus);
router.post('/checkout', createCheckoutSession);
router.post('/portal', createPortalSession);

module.exports = router;
