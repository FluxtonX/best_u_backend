const HealthLog = require('../models/HealthLog');
const WeightLog = require('../models/WeightLog');
const PersonalBest = require('../models/PersonalBest');
const UserProgress = require('../models/UserProgress');
const User = require('../models/User');

// @desc    Get progress summary
// @route   GET /api/v1/progress/summary
// @access  Private
const getProgressSummary = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const progress = await UserProgress.findOne({ userId: user._id });
    const pbsCount = await PersonalBest.countDocuments({ userId: user._id });

    const totalWorkouts = progress ? progress.completedWorkouts.length : 0;
    const weightLost = user.weight && user.targetWeight 
      ? Math.abs(user.weight - user.onboardingWeight) 
      : 0;

    res.status(200).json({
      success: true,
      data: {
        totalWorkouts,
        weightLost,
        personalBestsCount: pbsCount,
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Log weight
// @route   POST /api/v1/progress/weight
// @access  Private
const logWeight = async (req, res) => {
  try {
    const { weight, date } = req.body;
    const user = await User.findOne({ firebaseUid: req.user.uid });

    const newLog = await WeightLog.create({
      userId: user._id,
      weight,
      date: date || Date.now(),
    });

    // Update weight in profile
    user.weight = weight;
    await user.save();

    res.status(201).json({ success: true, data: newLog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Sync Health Data (Google Fit / Apple Health)
// @route   POST /api/v1/progress/sync-health
// @access  Private
const syncHealthData = async (req, res) => {
  try {
    const { source, steps, caloriesBurned, activeMinutes, distanceKm, date } = req.body;
    const user = await User.findOne({ firebaseUid: req.user.uid });

    // Use findOneAndUpdate with upsert to prevent duplicates for the same day
    const log = await HealthLog.findOneAndUpdate(
      { userId: user._id, date: new Date(date).setHours(0,0,0,0), source },
      { 
        steps, 
        caloriesBurned, 
        activeMinutes, 
        distanceKm,
        date: new Date(date).setHours(0,0,0,0)
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get weight history
// @route   GET /api/v1/progress/weight-history
// @access  Private
const getWeightHistory = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const logs = await WeightLog.find({ userId: user._id }).sort({ date: 1 });
    
    // Format for Flutter LineChart
    const data = logs.map(log => ({
      date: log.date.toISOString().split('T')[0],
      weight: log.weight
    }));

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get personal bests
// @route   GET /api/v1/progress/personal-bests
// @access  Private
const getPersonalBests = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const pbs = await PersonalBest.find({ userId: user._id }).sort({ achievedAt: -1 });
    
    res.status(200).json({ success: true, data: pbs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get strength levels (max weights for key exercises)
// @route   GET /api/v1/progress/strength-levels
// @access  Private
const getStrengthLevels = async (req, res) => {
  try {
    // Mock data for the bar chart as seen in progress_screen.dart
    res.status(200).json({
      success: true,
      data: [
        { exercise: 'Bench', maxWeight: 60 },
        { exercise: 'Row', maxWeight: 50 },
        { exercise: 'Press', maxWeight: 40 },
        { exercise: 'Squat', maxWeight: 80 },
        { exercise: 'Deadlift', maxWeight: 100 },
      ]
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProgressSummary,
  logWeight,
  getWeightHistory,
  getPersonalBests,
  getStrengthLevels,
  syncHealthData,
};
