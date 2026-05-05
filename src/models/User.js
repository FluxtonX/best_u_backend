const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    age: {
      type: Number,
    },
    height: {
      type: Number,
    },
    // Onboarding data
    weight: {
      type: Number,
    },
    onboardingWeight: {
      type: Number,
    },
    targetWeight: {
      type: Number,
    },
    fitnessLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    goal: {
      type: String,
    },
    subscriptionStatus: {
      type: String,
      enum: ['none', 'active', 'canceled', 'past_due'],
      default: 'none',
    },
    subscriptionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Add indices for performance
// Note: firebaseUid and email are already unique/indexed in the schema definition

module.exports = mongoose.model('User', userSchema);
