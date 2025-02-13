CREATE TABLE "activity_logs" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" integer,
	"action" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"ip_address" varchar(45)
);
