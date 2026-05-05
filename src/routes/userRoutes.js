const express = require('express');
const { check } = require('express-validator');
const { onboardUser, getUserProfile, updateUserProfile } = require('../controllers/userController');
const verifyFirebaseToken = require('../middlewares/authMiddleware');
const validate = require('../utils/validation');

const router = express.Router();

// Apply auth middleware to all user routes
router.use(verifyFirebaseToken);

router.post(
  '/onboarding',
  [
    check('name', 'Name is required').not().isEmpty().escape(),
    check('weight', 'Weight is required').isNumeric(),
    check('targetWeight', 'Target weight is required').isNumeric(),
    check('experienceLevel', 'Experience level is required').isIn(['Beginner', 'Intermediate', 'Advanced']),
    check('goal').optional().escape(),
    validate,
  ],
  onboardUser
);

router.route('/profile')
  .get(getUserProfile)
  .put(
    [
      check('name', 'Name cannot be empty').optional().not().isEmpty().escape(),
      check('weight', 'Weight must be numeric').optional().isNumeric(),
      check('targetWeight', 'Target weight must be numeric').optional().isNumeric(),
      check('goal').optional().escape(),
      validate,
    ],
    updateUserProfile
  );

module.exports = router;
