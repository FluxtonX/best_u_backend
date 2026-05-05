const mongoose = require('mongoose');

const healthLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    source: {
      type: String,
      enum: ['Google Fit', 'Apple Health'],
      required: true,
    },
    steps: {
      type: Number,
      default: 0,
    },
    caloriesBurned: {
      type: Number,
      default: 0,
    },
    activeMinutes: {
      type: Number,
      default: 0,
    },
    distanceKm: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent duplicate logs for the same day/source
healthLogSchema.index({ userId: 1, date: 1, source: 1 }, { unique: true });

module.exports = mongoose.model('HealthLog', healthLogSchema);
