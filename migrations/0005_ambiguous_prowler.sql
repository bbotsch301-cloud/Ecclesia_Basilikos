ALTER TYPE "public"."trust_relationship_type" ADD VALUE 'enters';--> statement-breakpoint
ALTER TABLE "courses" ADD COLUMN "free_preview_lessons" integer DEFAULT 1;--> statement-breakpoint
ALTER TABLE "public"."trust_entities" ALTER COLUMN "layer" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."trust_entity_layer";--> statement-breakpoint
CREATE TYPE "public"."trust_entity_layer" AS ENUM('covenant', 'body', 'stewardship', 'assembly', 'region', 'household', 'craft', 'ministry', 'member');--> statement-breakpoint
ALTER TABLE "public"."trust_entities" ALTER COLUMN "layer" SET DATA TYPE "public"."trust_entity_layer" USING "layer"::"public"."trust_entity_layer";