import { SquareClient, SquareEnvironment, WebhooksHelper } from "square";
import { storage } from "./storage";
import logger from "./logger";

let square: SquareClient | null = null;

const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;
const SQUARE_WEBHOOK_SIGNATURE_KEY = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
const SQUARE_SUBSCRIPTION_PLAN_ID = process.env.SQUARE_SUBSCRIPTION_PLAN_ID;
const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

if (SQUARE_ACCESS_TOKEN) {
  square = new SquareClient({
    token: SQUARE_ACCESS_TOKEN,
    environment: process.env.SQUARE_ENVIRONMENT === "production"
      ? SquareEnvironment.Production
      : SquareEnvironment.Sandbox,
  });
  logger.info("Square initialized successfully");
} else {
  logger.warn("SQUARE_ACCESS_TOKEN not set - Square integration disabled.");
}

export function isSquareEnabled(): boolean {
  return square !== null;
}

/**
 * Create a Square Checkout payment link for one-time or first installment payment.
 */
export async function createCheckoutUrl(
  userId: string,
  userEmail: string,
  paymentMode: "one_time" | "installment" = "one_time",
): Promise<string> {
  if (!square || !SQUARE_LOCATION_ID) {
    throw new Error("Square is not configured");
  }

  const user = await storage.getUser(userId);
  if (!user) {
    throw new Error("User not found");
  }

  if (user.subscriptionTier === "premium") {
    throw new Error("You are already a PMA Beneficiary");
  }

  // $500 one-time or $50 first installment (amounts in cents)
  const amountCents = paymentMode === "one_time" ? 50000 : 5000;
  const itemName = paymentMode === "one_time"
    ? "PMA Beneficial Interest — One-time Contribution"
    : "PMA Beneficial Interest — Installment (1 of 10)";

  const response = await square.checkout.paymentLinks.create({
    idempotencyKey: `${userId}-${paymentMode}-${Date.now()}`,
    order: {
      locationId: SQUARE_LOCATION_ID,
      lineItems: [{
        name: itemName,
        quantity: "1",
        basePriceMoney: {
          amount: BigInt(amountCents),
          currency: "USD",
        },
      }],
      metadata: {
        userId,
        paymentMode,
      },
    },
    checkoutOptions: {
      redirectUrl: `${BASE_URL}/billing?completed=true`,
      askForShippingAddress: false,
    },
    prePopulatedData: {
      buyerEmail: userEmail,
    },
  });

  const url = response.paymentLink?.url;
  if (!url) {
    throw new Error("Failed to create checkout URL");
  }

  return url;
}

/**
 * Verify Square webhook signature using HMAC-SHA256.
 */
export async function handleWebhookEvent(
  rawBody: string,
  signature: string,
  notificationUrl: string,
): Promise<void> {
  if (!SQUARE_WEBHOOK_SIGNATURE_KEY) {
    throw new Error("SQUARE_WEBHOOK_SIGNATURE_KEY is not configured");
  }

  const isValid = await WebhooksHelper.verifySignature({
    requestBody: rawBody,
    signatureHeader: signature,
    signatureKey: SQUARE_WEBHOOK_SIGNATURE_KEY,
    notificationUrl,
  });

  if (!isValid) {
    logger.error("Square webhook signature verification failed");
    throw new Error("Webhook signature verification failed");
  }

  const event = JSON.parse(rawBody);
  logger.info({ type: event.type, eventId: event.event_id }, "Processing Square webhook event");

  switch (event.type) {
    case "payment.completed": {
      const payment = event.data?.object?.payment;
      if (payment) await handlePaymentCompleted(payment);
      break;
    }
    case "subscription.updated": {
      const subscription = event.data?.object?.subscription;
      if (subscription) await handleSubscriptionUpdated(subscription);
      break;
    }
    case "subscription.created": {
      const subscription = event.data?.object?.subscription;
      if (subscription) {
        logger.info({ subscriptionId: subscription.id }, "Square subscription created");
      }
      break;
    }
    case "invoice.payment_made": {
      const invoice = event.data?.object?.invoice;
      if (invoice) {
        logger.info({ invoiceId: invoice.id, subscriptionId: invoice.subscription_id }, "Square subscription invoice paid");
        // Allocate 50% of invoice payment to treasury
        try {
          const invoiceAmount = invoice.payment_requests?.[0]?.computed_amount_money?.amount;
          const invoiceCents = invoiceAmount ? Number(invoiceAmount) : 5000; // fallback $50
          const treasuryAmount = Math.round(invoiceCents / 2);
          if (treasuryAmount > 0) {
            // Try to find user by subscription's customer_id
            let sourceUserId: string | undefined;
            if (invoice.primary_recipient?.customer_id) {
              const user = await storage.getUserBySquareCustomerId(invoice.primary_recipient.customer_id);
              sourceUserId = user?.id;
            }
            await storage.createTreasuryTransaction({
              type: 'installment_allocation',
              amountCents: treasuryAmount,
              currency: 'USD',
              description: `50% allocation from installment invoice payment`,
              sourcePaymentId: invoice.id || null,
              sourceSubscriptionId: invoice.subscription_id || null,
              sourceUserId: sourceUserId || null,
            });
            logger.info({ treasuryAmount, invoiceId: invoice.id }, "Treasury installment allocation recorded");
          }
        } catch (err) {
          logger.warn({ err, invoiceId: invoice.id }, "Failed to record treasury installment allocation");
        }
      }
      break;
    }
    default:
      logger.info({ type: event.type }, "Unhandled Square webhook event type");
  }
}

/**
 * Handle a completed payment from Square Checkout.
 * Grants PMA membership and issues beneficial unit.
 * For installment mode, attempts to create a subscription for remaining payments.
 */
async function handlePaymentCompleted(payment: any): Promise<void> {
  if (!square) return;

  const orderId = payment.order_id;
  if (!orderId) {
    logger.error("Payment completed but no order_id found");
    return;
  }

  // Retrieve order to get metadata (userId, paymentMode)
  const orderResponse = await square.orders.get({ orderId });
  const order = orderResponse.order;
  const userId = order?.metadata?.userId;
  const paymentMode = order?.metadata?.paymentMode || "one_time";

  if (!userId) {
    logger.error({ orderId }, "Payment order missing userId in metadata");
    return;
  }

  const customerId = payment.customer_id || null;
  const now = new Date();

  // Grant PMA membership
  await storage.updateUserSubscription(userId, {
    subscriptionTier: "premium",
    subscriptionStatus: "active",
    subscriptionStartDate: now,
    subscriptionEndDate: null,
    squareCustomerId: customerId || undefined,
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

  // Create subscription history record
  const amountCents = payment.total_money?.amount ? Number(payment.total_money.amount) : null;
  await storage.createSubscriptionRecord({
    userId,
    tier: "premium",
    status: "active",
    source: "square",
    startDate: now,
    squarePaymentId: payment.id || undefined,
    amount: amountCents,
    notes: paymentMode === "one_time"
      ? "PMA Beneficial Interest acquired — $500 one-time contribution"
      : "PMA Beneficial Interest acquired — $50×10 installment plan (first payment)",
  });

  // Allocate 50% to treasury
  try {
    const treasuryAmount = Math.round((amountCents || 0) / 2);
    if (treasuryAmount > 0) {
      await storage.createTreasuryTransaction({
        type: 'payment_allocation',
        amountCents: treasuryAmount,
        currency: 'USD',
        description: `50% allocation from ${paymentMode === "one_time" ? "one-time" : "first installment"} payment`,
        sourcePaymentId: payment.id || null,
        sourceUserId: userId,
      });
      logger.info({ userId, treasuryAmount }, "Treasury allocation recorded");
    }
  } catch (err) {
    logger.warn({ err, userId }, "Failed to record treasury allocation");
  }

  // For installment mode, try to create a subscription for remaining 9 payments
  if (paymentMode === "installment" && customerId) {
    await tryCreateSubscription(userId, customerId, payment);
  }

  logger.info({ userId, customerId, paymentMode }, "Checkout completed - beneficiary acquired PMA interest");
}

/**
 * After the first installment payment, attempt to create a Square subscription
 * for the remaining 9 monthly payments using the customer's card on file.
 */
async function tryCreateSubscription(userId: string, customerId: string, payment: any): Promise<void> {
  if (!square || !SQUARE_LOCATION_ID) return;

  if (!SQUARE_SUBSCRIPTION_PLAN_ID) {
    logger.warn("SQUARE_SUBSCRIPTION_PLAN_ID not set - cannot auto-create installment subscription. Admin should set up remaining payments manually.");
    return;
  }

  try {
    // Get the card used for the checkout payment
    const cardId = payment.card_details?.card?.id;

    if (!cardId) {
      logger.warn({ userId, customerId }, "No card ID found on payment - admin should create subscription manually");
      return;
    }

    // Start subscription next month for 9 remaining payments
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const startDate = nextMonth.toISOString().split("T")[0]; // YYYY-MM-DD

    // Calculate cancellation date: 9 months from start (first payment already made via checkout)
    const cancelDate = new Date(nextMonth);
    cancelDate.setMonth(cancelDate.getMonth() + 9);
    const canceledDate = cancelDate.toISOString().split("T")[0];

    const response = await square.subscriptions.create({
      idempotencyKey: `sub-${userId}-${Date.now()}`,
      locationId: SQUARE_LOCATION_ID,
      planVariationId: SQUARE_SUBSCRIPTION_PLAN_ID,
      customerId,
      cardId,
      startDate,
      canceledDate, // auto-cancel after 9 more payments
      source: {
        name: "Ecclesia Basilikos PMA",
      },
    });

    const subscriptionId = response.subscription?.id;
    if (subscriptionId) {
      await storage.updateUserSubscription(userId, {
        squareSubscriptionId: subscriptionId,
      });
      logger.info({ userId, subscriptionId }, "Installment subscription created for remaining 9 payments");
    }
  } catch (err) {
    logger.warn({ err, userId }, "Failed to auto-create installment subscription - admin should follow up");
  }
}

/**
 * Handle subscription status changes.
 * PMA membership is permanent — we never downgrade the user.
 */
async function handleSubscriptionUpdated(subscription: any): Promise<void> {
  const customerId = subscription.customer_id;
  if (!customerId) return;

  const user = await storage.getUserBySquareCustomerId(customerId);
  if (!user) {
    logger.error({ customerId }, "No user found for Square customer ID on subscription update");
    return;
  }

  const squareStatus = subscription.status; // ACTIVE, CANCELED, PAUSED, DEACTIVATED, PENDING
  const mappedStatus = squareStatus === "ACTIVE" ? "active"
    : squareStatus === "CANCELED" || squareStatus === "DEACTIVATED" ? "completed"
    : squareStatus === "PAUSED" ? "past_due"
    : "active";

  // PMA membership is permanent — never downgrade tier
  await storage.updateUserSubscription(user.id, {
    subscriptionStatus: mappedStatus,
    squareSubscriptionId: subscription.id,
  });

  if (squareStatus === "CANCELED" || squareStatus === "DEACTIVATED") {
    await storage.createSubscriptionRecord({
      userId: user.id,
      tier: "premium",
      status: "completed",
      source: "square",
      startDate: user.subscriptionStartDate || new Date(),
      endDate: new Date(),
      squareSubscriptionId: subscription.id,
      notes: "Installment plan completed or ended — PMA membership retained",
    });
  }

  logger.info({ userId: user.id, status: squareStatus }, "Square subscription updated — PMA membership retained");
}
