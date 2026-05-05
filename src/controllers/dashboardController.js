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
    
    let weekProgress = "0/0 days";
    let streak = progress ? progress.currentStreak : 0;
    let weightLost = 0;
    let todaysWorkout = null;

    if (progress) {
      // 1. Calculate Week Progress (e.g., "3/3 days")
      const currentWeekWorkouts = progress.completedWorkouts.filter(w => {
        // Logic to filter workouts from the current week
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return w.date >= oneWeekAgo;
      });
      weekProgress = `${currentWeekWorkouts.length}/3 days`;

      // 2. Calculate Weight Lost
      if (user.weight && user.targetWeight) {
        weightLost = Math.abs(user.weight - (user.onboardingWeight || user.weight));
      }

      // 3. Get Today's Workout
      if (progress.activeProgramId) {
        todaysWorkout = await Workout.findOne({ 
          programId: progress.activeProgramId._id,
          // You could add logic here to find the next uncompleted workout
        }).select('title estimatedDurationMinutes exercises');
      }
    }

    // 4. Get Latest Health Stats (Google Fit / Apple Health)
    const latestHealth = await HealthLog.findOne({ userId: user._id }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      data: {
        weekInfo: {
          current: "Week 2/8", // Mock logic, could be dynamic
          remaining: "6 weeks remaining"
        },
        stats: {
          weekProgress,
          streak: `${streak} weeks`,
          weightProgress: `-${weightLost.toFixed(1)} kg`,
          steps: latestHealth ? latestHealth.steps : 0
        },
        todaysWorkout: todaysWorkout ? {
          id: todaysWorkout._id,
          title: todaysWorkout.title,
          day: "DAY 2",
          duration: `${todaysWorkout.estimatedDurationMinutes} min`,
          exercisesCount: `${todaysWorkout.exercises.length} exercises`,
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
    // Returning format that matches Flutter's JSON expectations
    res.status(200).json({
      success: true,
      quote: "The only bad workout is the one that didn't happen.",
      author: "Unknown"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getDashboardSummary,
  getDailyQuote,
};
