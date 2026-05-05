const express = require('express');
const { check } = require('express-validator');
const { getActiveProgram, getWorkoutById, completeWorkout, getAllPrograms } = require('../controllers/workoutController');
const verifyFirebaseToken = require('../middlewares/authMiddleware');
const validate = require('../utils/validation');

const router = express.Router();

router.use(verifyFirebaseToken);

// Programs
router.get('/programs', getAllPrograms);
router.get('/programs/active', getActiveProgram);

// Workouts
router.get('/workouts/:id', getWorkoutById);
router.post(
  '/workouts/:id/complete',
  [
    check('timeTakenMinutes', 'Time taken is required').isNumeric(),
    validate,
  ],
  completeWorkout
);

module.exports = router;
