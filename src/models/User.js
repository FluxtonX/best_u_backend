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
    // Onboarding data
    currentWeight: {
      type: Number,
    },
    targetWeight: {
      type: Number,
    },
    fitnessLevel: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
    goals: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
