const User = require('../models/User');

// @desc    Onboard a new user after Firebase signup
// @route   POST /api/v1/users/onboarding
// @access  Private
const onboardUser = async (req, res) => {
  try {
    const { currentWeight, targetWeight, fitnessLevel, goals, name } = req.body;
    const { uid, email } = req.user; // From Firebase Auth Middleware

    // Check if user already exists
    let user = await User.findOne({ firebaseUid: uid });
    
    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    user = await User.create({
      firebaseUid: uid,
      email,
      name,
      currentWeight,
      targetWeight,
      fitnessLevel,
      goals,
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/v1/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const { name, avatar, currentWeight, targetWeight, goals } = req.body;

    let user = await User.findOne({ firebaseUid: req.user.uid });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.name = name || user.name;
    user.avatar = avatar || user.avatar;
    user.currentWeight = currentWeight || user.currentWeight;
    user.targetWeight = targetWeight || user.targetWeight;
    user.goals = goals || user.goals;

    const updatedUser = await user.save();

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  onboardUser,
  getUserProfile,
  updateUserProfile,
};
