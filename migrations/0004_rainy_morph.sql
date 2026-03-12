ALTER TYPE "public"."trust_entity_layer" ADD VALUE 'guild';--> statement-breakpoint
ALTER TYPE "public"."trust_entity_layer" ADD VALUE 'beneficiary';--> statement-breakpoint
ALTER TYPE "public"."trust_relationship_type" ADD VALUE 'benefits';--> statement-breakpoint
ALTER TYPE "public"."trust_relationship_type" ADD VALUE 'shepherds';--> statement-breakpoint
ALTER TYPE "public"."trust_relationship_type" ADD VALUE 'teaches';--> statement-breakpoint
ALTER TYPE "public"."trust_relationship_type" ADD VALUE 'serves';--> statement-breakpoint
ALTER TYPE "public"."trust_relationship_type" ADD VALUE 'tithes';--> statement-breakpoint
ALTER TYPE "public"."trust_role" ADD VALUE 'elder';--> statement-breakpoint
ALTER TYPE "public"."trust_role" ADD VALUE 'deacon';--> statement-breakpoint
ALTER TYPE "public"."trust_role" ADD VALUE 'apostle';--> statement-breakpoint
ALTER TYPE "public"."trust_role" ADD VALUE 'prophet';--> statement-breakpoint
ALTER TYPE "public"."trust_role" ADD VALUE 'evangelist';--> statement-breakpoint
ALTER TYPE "public"."trust_role" ADD VALUE 'pastor';--> statement-breakpoint
ALTER TYPE "public"."trust_role" ADD VALUE 'teacher';--> statement-breakpoint
CREATE TABLE "trust_document_sections" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" varchar NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "trust_document_templates" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"applicable_layers" text[],
	"is_built_in" boolean DEFAULT false,
	"status" text DEFAULT 'active',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trust_documents" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"entity_id" varchar NOT NULL,
	"template_id" varchar,
	"title" text NOT NULL,
	"subtitle" text,
	"version" integer DEFAULT 1,
	"status" text DEFAULT 'draft',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "trust_template_sections" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" varchar NOT NULL,
	"title" text NOT NULL,
	"content_template" text NOT NULL,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "trust_document_sections" ADD CONSTRAINT "trust_document_sections_document_id_trust_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."trust_documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trust_documents" ADD CONSTRAINT "trust_documents_entity_id_trust_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."trust_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trust_documents" ADD CONSTRAINT "trust_documents_template_id_trust_document_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."trust_document_templates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "trust_template_sections" ADD CONSTRAINT "trust_template_sections_template_id_trust_document_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."trust_document_templates"("id") ON DELETE cascade ON UPDATE no action;