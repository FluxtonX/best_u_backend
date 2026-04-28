const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    activeProgramId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
    },
    completedWorkouts: [
      {
        workoutId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Workout',
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
        timeTakenMinutes: Number,
        volumeLifted: Number,
      },
    ],
    currentStreak: {
      type: Number,
      default: 0,
    },
    lastWorkoutDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserProgress', userProgressSchema);
