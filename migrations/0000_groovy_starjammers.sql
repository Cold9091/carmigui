CREATE TABLE "contacts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"area" integer NOT NULL,
	"duration" text NOT NULL,
	"units" text NOT NULL,
	"year" text NOT NULL,
	"status" text NOT NULL,
	"images" text[] DEFAULT '{}',
	"featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"price" numeric NOT NULL,
	"location" text NOT NULL,
	"type" text NOT NULL,
	"bedrooms" integer,
	"bathrooms" integer,
	"area" integer NOT NULL,
	"images" text[] DEFAULT '{}',
	"status" text DEFAULT 'available' NOT NULL,
	"featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
