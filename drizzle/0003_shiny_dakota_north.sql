CREATE TYPE "public"."localeEnum" AS ENUM('en', 'es', 'cs', 'pl', 'fr', 'de', 'it', 'pt');--> statement-breakpoint
CREATE TABLE "translations" (
	"id" text PRIMARY KEY NOT NULL,
	"keyId" text NOT NULL,
	"value" text NOT NULL,
	"locale" "localeEnum",
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"createdBy" text NOT NULL,
	"lastUpdatedBy" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "translationsKeys" (
	"id" text PRIMARY KEY NOT NULL,
	"key" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp NOT NULL,
	"createdBy" text NOT NULL,
	"projectId" text NOT NULL,
	CONSTRAINT "translationsKeys_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "translations" ADD CONSTRAINT "translations_keyId_translationsKeys_id_fk" FOREIGN KEY ("keyId") REFERENCES "public"."translationsKeys"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "translations" ADD CONSTRAINT "translations_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "translations" ADD CONSTRAINT "translations_lastUpdatedBy_users_id_fk" FOREIGN KEY ("lastUpdatedBy") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "translationsKeys" ADD CONSTRAINT "translationsKeys_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "translationsKeys" ADD CONSTRAINT "translationsKeys_projectId_projects_id_fk" FOREIGN KEY ("projectId") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE cascade;