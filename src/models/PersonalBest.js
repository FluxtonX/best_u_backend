const mongoose = require('mongoose');

const personalBestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    exerciseName: {
      type: String,
      required: true,
    },
    value: {
      type: String, // e.g., "65 kg" or "8 reps"
      required: true,
    },
    achievedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PersonalBest', personalBestSchema);
