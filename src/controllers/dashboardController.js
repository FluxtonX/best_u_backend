const UserProgress = require('../models/UserProgress');
const Workout = require('../models/Workout');
const User = require('../models/User');

// @desc    Get dashboard summary
// @route   GET /api/v1/dashboard/summary
// @access  Private
const getDashboardSummary = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Fetch user progress
    const progress = await UserProgress.findOne({ userId: user._id }).populate('activeProgramId');
    
    let weekProgress = "0/0";
    let streak = progress ? progress.currentStreak : 0;
    let todaysWorkout = null;

    if (progress && progress.activeProgramId) {
      // In a real app, calculate current week based on start date or completed workouts
      const currentWeek = 1;
      const totalWeeks = progress.activeProgramId.totalWeeks;
      weekProgress = `${currentWeek}/${totalWeeks}`;

      // Mock finding today's workout
      todaysWorkout = await Workout.findOne({ 
        programId: progress.activeProgramId._id, 
        weekNumber: currentWeek,
        dayNumber: 1 // Defaulting to day 1 for now
      });
    }

    res.status(200).json({
      success: true,
      data: {
        weekProgress,
        streak,
        weightProgress: user.currentWeight && user.targetWeight 
          ? `${(user.targetWeight - user.currentWeight).toFixed(1)} kg to go` 
          : "N/A",
        todaysWorkout: todaysWorkout ? {
          id: todaysWorkout._id,
          title: todaysWorkout.title,
          duration: todaysWorkout.estimatedDurationMinutes,
          exercisesCount: todaysWorkout.exercises.length,
        } : null,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get daily motivational quote
// @route   GET /api/v1/dashboard/quotes/daily
// @access  Private
const getDailyQuote = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: {
        quote: "The only bad workout is the one that didn't happen.",
        author: "Unknown"
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardSummary,
  getDailyQuote,
};
