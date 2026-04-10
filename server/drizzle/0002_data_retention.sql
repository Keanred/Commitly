ALTER TABLE "users" ADD COLUMN "longest_streak" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "branches" DROP COLUMN "last_commit_sha";
