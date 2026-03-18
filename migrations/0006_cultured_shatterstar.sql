ALTER TABLE "subscriptions" ADD COLUMN "square_payment_id" text;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "square_subscription_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "square_customer_id" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "square_subscription_id" text;