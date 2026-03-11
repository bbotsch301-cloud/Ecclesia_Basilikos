import Stripe from "stripe";
import { storage } from "./storage";
import logger from "./logger";

let stripe: Stripe | null = null;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  logger.info("Stripe initialized successfully");
} else {
  logger.warn("STRIPE_SECRET_KEY not set - Stripe integration disabled.");
}

export function isStripeEnabled(): boolean {
  return stripe !== null;
}

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// Environment variables for two price options:
// STRIPE_PRICE_ID_ONETIME = $500 one-time payment price
// STRIPE_PRICE_ID_INSTALLMENT = $50/month installment price (10 payments)
// Legacy STRIPE_PRICE_ID also supported as fallback

export async function createCheckoutSession(
  userId: string,
  userEmail: string,
  priceId: string,
  paymentMode: "one_time" | "installment" = "one_time",
): Promise<string> {
  if (!stripe) {
    throw new Error("Stripe is not configured");
  }

  const user = await storage.getUser(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.subscriptionTier === "premium") {
    throw new Error("You are already a PMA Beneficiary");
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: paymentMode === "one_time" ? "payment" : "subscription",
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
      paymentMode,
    },
  };

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
  const subscriptionId = session.subscription as string | null;
  const paymentMode = session.metadata?.paymentMode || "one_time";

  const now = new Date();

  // Grant PMA membership
  await storage.updateUserSubscription(userId, {
    subscriptionTier: "premium",
    subscriptionStatus: "active",
    subscriptionStartDate: now,
    subscriptionEndDate: null,
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId || undefined,
  });

  // Set PMA agreement accepted timestamp
  try {
    const { db } = await import("./db");
    const { users } = await import("@shared/schema");
    const { eq } = await import("drizzle-orm");
    await db.update(users).set({ pmaAgreementAcceptedAt: now }).where(eq(users.id, userId));
  } catch (err) {
    logger.warn({ err, userId }, "Failed to set pmaAgreementAcceptedAt");
  }

  // Issue beneficial unit
  try {
    await storage.issueBeneficialUnit(userId);
  } catch (err) {
    logger.warn({ err, userId }, "Failed to issue beneficial unit on checkout");
  }

  // Create record for history
  await storage.createSubscriptionRecord({
    userId,
    tier: "premium",
    status: "active",
    source: "stripe",
    startDate: now,
    stripeSubscriptionId: subscriptionId || undefined,
    amount: session.amount_total,
    notes: paymentMode === "one_time"
      ? "PMA Beneficial Interest acquired — $500 one-time contribution"
      : "PMA Beneficial Interest acquired — $50×10 installment plan",
  });

  logger.info({ userId, customerId, paymentMode }, "Checkout completed - beneficiary acquired PMA interest");
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const customerId = subscription.customer as string;
  const user = await findUserByStripeCustomerId(customerId);
  if (!user) {
    logger.error({ customerId }, "No user found for Stripe customer ID on subscription update");
    return;
  }

  // For installment plans: keep premium active as long as subscription is active
  const status = mapStripeStatus(subscription.status);
  const tier = subscription.status === "active" || subscription.status === "trialing" ? "premium" : user.subscriptionTier || "free";

  await storage.updateUserSubscription(user.id, {
    subscriptionTier: tier,
    subscriptionStatus: status,
    stripeSubscriptionId: subscription.id,
  });

  logger.info({ userId: user.id, status, tier }, "Installment subscription updated via Stripe webhook");
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  const customerId = subscription.customer as string;
  const user = await findUserByStripeCustomerId(customerId);
  if (!user) {
    logger.error({ customerId }, "No user found for Stripe customer ID on subscription delete");
    return;
  }

  // For installment plan: check if all 10 payments were made
  // If the subscription completed naturally (all payments made), keep premium
  // If cancelled early, user still keeps PMA membership (they already have the unit)
  // PMA membership is permanent once acquired — do NOT downgrade
  const now = new Date();

  await storage.createSubscriptionRecord({
    userId: user.id,
    tier: "premium",
    status: "completed",
    source: "stripe",
    startDate: user.subscriptionStartDate || now,
    endDate: now,
    stripeSubscriptionId: subscription.id,
    notes: "Installment plan completed or ended",
  });

  // Update subscription status but keep tier as premium (PMA is permanent)
  await storage.updateUserSubscription(user.id, {
    subscriptionStatus: "completed",
  });

  logger.info({ userId: user.id }, "Installment subscription ended - PMA membership retained");
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

  logger.warn({ userId: user.id }, "Installment payment failed - marked as past_due");
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
