const Program = require('../models/Program');
const Workout = require('../models/Workout');
const UserProgress = require('../models/UserProgress');
const User = require('../models/User');
const paginate = require('../utils/pagination');

// @desc    Get all programs
// @route   GET /api/v1/programs
// @access  Private
const getAllPrograms = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const results = await paginate(Program, { isActive: true }, page, limit);
    
    res.status(200).json({
      success: true,
      ...results
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get active program
// @route   GET /api/v1/programs/active
// @access  Private
const getActiveProgram = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const progress = await UserProgress.findOne({ userId: user._id }).populate('activeProgramId');
    
    if (!progress || !progress.activeProgramId) {
      return res.status(404).json({ success: false, message: 'No active program found' });
    }

    // In reality, you'd calculate progress based on completed workouts vs total workouts
    res.status(200).json({
      success: true,
      data: {
        programName: progress.activeProgramId.title,
        progressPercentage: 21, // Mock
        weeks: [
          // Mock data structure expected by frontend
          { weekNum: 1, status: '3/3 workouts', isCompleted: true },
          { weekNum: 2, status: '2/3 workouts', isCurrent: true },
        ]
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get specific workout
// @route   GET /api/v1/workouts/:id
// @access  Private
const getWorkoutById = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) {
      return res.status(404).json({ success: false, message: 'Workout not found' });
    }
    res.status(200).json({ success: true, data: workout });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Complete a workout
// @route   POST /api/v1/workouts/:id/complete
// @access  Private
const completeWorkout = async (req, res) => {
  try {
    const { timeTakenMinutes, volumeLifted } = req.body;
    const user = await User.findOne({ firebaseUid: req.user.uid });
    
    let progress = await UserProgress.findOne({ userId: user._id });
    if (!progress) {
      progress = await UserProgress.create({ userId: user._id });
    }

    progress.completedWorkouts.push({
      workoutId: req.params.id,
      timeTakenMinutes,
      volumeLifted,
    });
    
    progress.currentStreak += 1;
    progress.lastWorkoutDate = Date.now();
    await progress.save();

    res.status(200).json({ success: true, message: 'Workout completed successfully', newStreak: progress.currentStreak });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllPrograms,
  getActiveProgram,
  getWorkoutById,
  completeWorkout,
};
