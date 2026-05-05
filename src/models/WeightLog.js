const mongoose = require('mongoose');

const weightLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
  },
  { timestamps: true }
);

// Add indices for performance
weightLogSchema.index({ userId: 1 });
weightLogSchema.index({ date: -1 });

module.exports = mongoose.model('WeightLog', weightLogSchema);
