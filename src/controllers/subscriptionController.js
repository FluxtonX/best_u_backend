const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Subscription = require('../models/Subscription');

// @desc    Get subscription status
// @route   GET /api/v1/subscriptions/status
// @access  Private
const getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    res.status(200).json({
      success: true,
      status: user.subscriptionStatus,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Stripe checkout session
// @route   POST /api/v1/subscriptions/checkout
// @access  Private
const createCheckoutSession = async (req, res) => {
  try {
    const { priceId } = req.body;
    const user = await User.findOne({ firebaseUid: req.user.uid });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      customer_email: user.email,
      metadata: {
        userId: user._id.toString(),
      },
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create Stripe Customer Portal session
// @route   POST /api/v1/subscriptions/portal
// @access  Private
const createPortalSession = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    const subRecord = await Subscription.findOne({ userId: user._id });

    if (!subRecord || !subRecord.stripeCustomerId) {
      return res.status(400).json({ success: false, message: 'No active subscription found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: subRecord.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/profile`,
    });

    res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Handle Stripe webhooks
// @route   POST /api/v1/subscriptions/webhook
// @access  Public
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      await updateSubscription(session);
      break;
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      await syncSubscription(subscription);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
};

// Helper to update subscription after checkout
const updateSubscription = async (session) => {
  const userId = session.metadata.userId;
  const stripeSubscriptionId = session.subscription;
  const stripeCustomerId = session.customer;

  const subscription = await stripe.subscriptions.retrieve(stripeSubscriptionId);

  await User.findByIdAndUpdate(userId, {
    subscriptionStatus: 'active',
    subscriptionId: stripeSubscriptionId,
  });

  await Subscription.create({
    userId,
    stripeSubscriptionId,
    stripeCustomerId,
    planId: subscription.items.data[0].price.id,
    status: 'active',
    currentPeriodEnd: new Date(subscription.current_period_end * 1000),
  });
};

// Helper to sync subscription changes
const syncSubscription = async (stripeSub) => {
  const status = stripeSub.status === 'active' ? 'active' : 'canceled';
  
  const subRecord = await Subscription.findOneAndUpdate(
    { stripeSubscriptionId: stripeSub.id },
    {
      status: stripeSub.status,
      currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
      cancelAtPeriodEnd: stripeSub.cancel_at_period_end,
    },
    { new: true }
  );

  if (subRecord) {
    await User.findByIdAndUpdate(subRecord.userId, {
      subscriptionStatus: status,
    });
  }
};

module.exports = {
  getSubscriptionStatus,
  createCheckoutSession,
  createPortalSession,
  handleWebhook,
};
