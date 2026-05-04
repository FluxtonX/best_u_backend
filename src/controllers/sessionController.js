const ExerciseLog = require('../models/ExerciseLog');
const User = require('../models/User');
const PersonalBest = require('../models/PersonalBest');

// @desc    Log a single set during exercise session
// @route   POST /api/v1/workouts/session/log-set
// @access  Private
const logExerciseSet = async (req, res) => {
  try {
    const { exerciseName, weight, reps, setNumber, workoutSessionId } = req.body;
    const user = await User.findOne({ firebaseUid: req.user.uid });

    const newLog = await ExerciseLog.create({
      userId: user._id,
      workoutSessionId,
      exerciseName,
      setNumber,
      weight,
      reps
    });

    // Check if this is a new Personal Best for this specific exercise
    const previousPB = await PersonalBest.findOne({ 
      userId: user._id, 
      exerciseName 
    }).sort({ value: -1 });

    let isNewPB = false;
    // Simple logic: if weight is higher than previous best
    if (!previousPB || weight > parseFloat(previousPB.value)) {
      isNewPB = true;
      // We don't save the PB yet, we might wait for the whole session to finish 
      // or save it instantly. Let's save it instantly for the "New PB" screen.
      await PersonalBest.create({
        userId: user._id,
        exerciseName,
        value: `${weight} kg`,
        achievedAt: Date.now()
      });
    }

    res.status(201).json({
      success: true,
      data: newLog,
      isNewPB,
      oldRecord: previousPB ? previousPB.value : "0 kg"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get exercise history (Previous & Target)
// @route   GET /api/v1/workouts/exercise/history/:exerciseName
// @access  Private
const getExerciseHistory = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const { exerciseName } = req.params;

    // Find the last session results for this exercise
    const lastLog = await ExerciseLog.findOne({
      userId: user._id,
      exerciseName
    }).sort({ createdAt: -1 });

    const bestLog = await PersonalBest.findOne({
      userId: user._id,
      exerciseName
    }).sort({ achievedAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        previous: lastLog ? `${lastLog.weight} kg` : "N/A",
        target: bestLog ? `${parseFloat(bestLog.value) + 2.5} kg` : "N/A", // Suggested target
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  logExerciseSet,
  getExerciseHistory
};
