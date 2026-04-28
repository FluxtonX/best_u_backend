const express = require('express');
const { onboardUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const verifyFirebaseToken = require('../middlewares/authMiddleware');

const router = express.Router();

// Apply auth middleware to all user routes
router.use(verifyFirebaseToken);

router.post('/onboarding', onboardUser);
router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

module.exports = router;
