const express = require('express');
const { getActiveProgram, getWorkoutById, completeWorkout } = require('../controllers/workoutController');
const verifyFirebaseToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyFirebaseToken);

// Note: In index.js we might mount this at /api/v1/programs or /api/v1/workouts.
// We will split them or handle routing there.
// For simplicity, we can mount this at /api/v1
router.get('/programs/active', getActiveProgram);
router.get('/workouts/:id', getWorkoutById);
router.post('/workouts/:id/complete', completeWorkout);

module.exports = router;
