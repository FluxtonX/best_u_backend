const express = require('express');
const { logExerciseSet, getExerciseHistory } = require('../controllers/sessionController');
const verifyFirebaseToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(verifyFirebaseToken);

router.post('/session/log-set', logExerciseSet);
router.get('/exercise/history/:exerciseName', getExerciseHistory);

module.exports = router;
