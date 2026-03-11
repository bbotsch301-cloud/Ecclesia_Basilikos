CREATE TYPE "public"."trust_entity_layer" AS ENUM('charter', 'trust', 'operational', 'pma', 'platform', 'chapter', 'commune', 'project');--> statement-breakpoint
CREATE TYPE "public"."trust_relationship_type" AS ENUM('authority', 'grants', 'funds', 'land', 'remits', 'establishes_pma', 'oversees', 'coordinates');--> statement-breakpoint
CREATE TYPE "public"."trust_role" AS ENUM('grantor', 'trustee', 'protector', 'steward', 'beneficiary', 'officer');--> statement-breakpoint
CREATE TABLE "beneficial_units" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"unit_number" integer NOT NULL,
	"issued_at" timestamp DEFAULT now(),
	"status" text DEFAULT 'active',
	"withdrawn_at" timestamp,
	CONSTRAINT "beneficial_units_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "beneficial_units_unit_number_unique" UNIQUE("unit_number")
);
--> statement-breakpoint
CREATE TABLE "trust_entities" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"subtitle" text,
	"layer" "trust_entity_layer" NOT NULL,
	"entity_type" text NOT NULL,
	"description" text,
	"trustee_label" text,
	"protector_label" text,
	"location" text,
	"acreage" text,
	"total_value" integer,
	"annual_revenue" integer,
	"member_count" integer DEFAULT 0,
	"status" text DEFAULT 'active',
	"color" text,
	"icon" text,
	"sort_order" integer DEFAULT 0,
	"charter" text,
	"legal_basis" text,
	"notes" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trust_relationships" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"from_entity_id" varchar NOT NULL,
	"to_entity_id" varchar NOT NULL,
	"relationship_type" "trust_relationship_type" NOT NULL,
	"label" text,
	"notes" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "forum_likes" DROP CONSTRAINT "forum_likes_thread_id_forum_threads_id_fk";
--> statement-breakpoint
ALTER TABLE "forum_likes" DROP CONSTRAINT "forum_likes_reply_id_forum_replies_id_fk";
--> statement-breakpoint
ALTER TABLE "forum_replies" DROP CONSTRAINT "forum_replies_thread_id_forum_threads_id_fk";
--> statement-breakpoint
ALTER TABLE "forum_threads" DROP CONSTRAINT "forum_threads_category_id_forum_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "pma_agreement_accepted_at" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "beneficial_unit_id" varchar;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "email_notifications" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "beneficial_units" ADD CONSTRAINT "beneficial_units_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trust_relationships" ADD CONSTRAINT "trust_relationships_from_entity_id_trust_entities_id_fk" FOREIGN KEY ("from_entity_id") REFERENCES "public"."trust_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trust_relationships" ADD CONSTRAINT "trust_relationships_to_entity_id_trust_entities_id_fk" FOREIGN KEY ("to_entity_id") REFERENCES "public"."trust_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "trust_rel_from_idx" ON "trust_relationships" USING btree ("from_entity_id");--> statement-breakpoint
CREATE INDEX "trust_rel_to_idx" ON "trust_relationships" USING btree ("to_entity_id");--> statement-breakpoint
ALTER TABLE "forum_likes" ADD CONSTRAINT "forum_likes_thread_id_forum_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."forum_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_likes" ADD CONSTRAINT "forum_likes_reply_id_forum_replies_id_fk" FOREIGN KEY ("reply_id") REFERENCES "public"."forum_replies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_replies" ADD CONSTRAINT "forum_replies_thread_id_forum_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."forum_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "forum_threads" ADD CONSTRAINT "forum_threads_category_id_forum_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."forum_categories"("id") ON DELETE cascade ON UPDATE no action;