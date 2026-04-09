ALTER TABLE "branches" ALTER COLUMN "is_default" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "branches" ALTER COLUMN "fetched_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "commits" ALTER COLUMN "additions" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "commits" ALTER COLUMN "deletions" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "commits" ALTER COLUMN "fetched_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "languages" ALTER COLUMN "bytes" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "languages" ALTER COLUMN "fetched_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pull_requests" ALTER COLUMN "merged" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "pull_requests" ALTER COLUMN "fetched_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "repos" ALTER COLUMN "stars" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "repos" ALTER COLUMN "forks" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "repos" ALTER COLUMN "open_issues" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "repos" ALTER COLUMN "has_readme" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "repos" ALTER COLUMN "fetched_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "weekly_summaries" ALTER COLUMN "generated_at" SET NOT NULL;