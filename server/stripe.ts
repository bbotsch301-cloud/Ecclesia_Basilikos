import Stripe from "stripe";
import { storage } from "./storage";
import logger from "./logger";

// Initialize Stripe - gracefully handle missing key
let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  logger.info("Stripe initialized successfully");
} else {
  logger.warn("STRIPE_SECRET_KEY not set - Stripe integration disabled. Subscriptions can only be managed by admins.");
}

export function isStripeEnabled(): boolean {
  return stripe !== null;
}

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";
const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID;

export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  priceId: string,
): Promise<string> {
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  // Check if user already has a Stripe customer ID
  const user = await storage.getUser(userId);
  if (!user) {
    throw new Error("User not found");
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${BASE_URL}/billing?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${BASE_URL}/pricing`,
    metadata: {
      userId,
    },
  };

  // Use existing customer or set email for new customer
  if (user.stripeCustomerId) {
    sessionParams.customer = user.stripeCustomerId;
  } else {
    sessionParams.customer_email = userEmail;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  if (!session.url) {
    throw new Error("Failed to create checkout session URL");
  }

  return session.url;
}

export async function createBillingPortalSession(
  stripeCustomerId: string,
): Promise<string> {
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${BASE_URL}/billing`,
  });

  return session.url;
}

export async function handleWebhookEvent(
  payload: Buffer,
  signature: string,
): Promise<void> {
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (err) {
    logger.error({ err }, "Stripe webhook signature verification failed");
    throw new Error("Webhook signature verification failed");
  }

  logger.info({ type: event.type, id: event.id }, "Processing Stripe webhook event");

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      await handleCheckoutCompleted(session);
      break;
    }
    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdated(subscription);
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionDeleted(subscription);
      break;
    }
    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      await handlePaymentFailed(invoice);
      break;
    }
    default:
      logger.info({ type: event.type }, "Unhandled Stripe webhook event type");
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const userId = session.metadata?.userId;
  if (!userId) {
    logger.error("Checkout session missing userId in metadata");
    return;
  }

  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  const now = new Date();

  // Update user subscription fields
  await storage.updateUserSubscription(userId, {
    subscriptionTier: "premium",
    subscriptionStatus: "active",
    subscriptionStartDate: now,
    subscriptionEndDate: null,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
  });

  // Create subscription record for history
  await storage.createSubscriptionRecord({
    userId,
    tier: "premium",
    status: "active",
    source: "stripe",
    startDate: now,
    stripeSubscriptionId: subscriptionId,
    amount: session.amount_total,
    notes: "Subscribed via Stripe Checkout",
  });

  logger.info({ userId, customerId, subscriptionId }, "Checkout completed - user upgraded to premium");
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const customerId = subscription.customer as string;
  const user = await findUserByStripeCustomerId(customerId);
  if (!user) {
    logger.error({ customerId }, "No user found for Stripe customer ID on subscription update");
    return;
  }

  const status = mapStripeStatus(subscription.status);
  const tier = subscription.status === "active" || subscription.status === "trialing" ? "premium" : "free";

  await storage.updateUserSubscription(user.id, {
    subscriptionTier: tier,
    subscriptionStatus: status,
    stripeSubscriptionId: subscription.id,
  });

  logger.info({ userId: user.id, status, tier }, "Subscription updated via Stripe webhook");
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const customerId = subscription.customer as string;
  const user = await findUserByStripeCustomerId(customerId);
  if (!user) {
    logger.error({ customerId }, "No user found for Stripe customer ID on subscription delete");
    return;
  }

  const now = new Date();

  await storage.updateUserSubscription(user.id, {
    subscriptionTier: "free",
    subscriptionStatus: "cancelled",
    subscriptionEndDate: now,
  });

  // Create subscription record for history
  await storage.createSubscriptionRecord({
    userId: user.id,
    tier: "free",
    status: "cancelled",
    source: "stripe",
    startDate: user.subscriptionStartDate || now,
    endDate: now,
    cancelledAt: now,
    stripeSubscriptionId: subscription.id,
    notes: "Subscription cancelled/deleted via Stripe",
  });

  logger.info({ userId: user.id }, "Subscription deleted - user downgraded to free");
}

async function handlePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  const customerId = invoice.customer as string;
  const user = await findUserByStripeCustomerId(customerId);
  if (!user) {
    logger.error({ customerId }, "No user found for Stripe customer ID on payment failure");
    return;
  }

  await storage.updateUserSubscription(user.id, {
    subscriptionStatus: "past_due",
  });

  logger.warn({ userId: user.id }, "Payment failed - subscription marked as past_due");
}

function mapStripeStatus(stripeStatus: string): string {
  switch (stripeStatus) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "canceled":
      return "cancelled";
    case "past_due":
      return "past_due";
    case "unpaid":
      return "expired";
    default:
      return "none";
  }
}

async function findUserByStripeCustomerId(customerId: string) {
  return storage.getUserByStripeCustomerId(customerId);
}
