const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sets: { type: Number, required: true },
  reps: { type: String, required: true }, // e.g. "8-12" or "To failure"
  restSeconds: { type: Number, default: 60 },
  videoUrl: String,
});

const workoutSchema = new mongoose.Schema(
  {
    programId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Program',
      required: true,
    },
    weekNumber: {
      type: Number,
      required: true,
    },
    dayNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: 'Base', // e.g. Base, Cardio, Recovery
    },
    estimatedDurationMinutes: {
      type: Number,
      default: 45,
    },
    exercises: [exerciseSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workout', workoutSchema);
