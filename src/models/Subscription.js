const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stripeSubscriptionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    stripeCustomerId: {
      type: String,
    },
    planId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'unpaid', 'trialing'],
      default: 'active',
    },
    currentPeriodEnd: {
      type: Date,
    },
    cancelAtPeriodEnd: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

subscriptionSchema.index({ userId: 1 });
// stripeSubscriptionId is already unique in the schema definition

module.exports = mongoose.model('Subscription', subscriptionSchema);
