CREATE TABLE "branches" (
	"id" serial PRIMARY KEY NOT NULL,
	"repo_id" integer NOT NULL,
	"name" text NOT NULL,
	"last_commit_sha" text,
	"last_commit_date" timestamp with time zone,
	"is_default" boolean DEFAULT false,
	"fetched_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "branches_repo_id_name_unique" UNIQUE("repo_id","name")
);
--> statement-breakpoint
CREATE TABLE "commits" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"repo_id" integer NOT NULL,
	"sha" text NOT NULL,
	"message" text,
	"additions" integer DEFAULT 0,
	"deletions" integer DEFAULT 0,
	"committed_at" timestamp with time zone NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "commits_repo_id_sha_unique" UNIQUE("repo_id","sha")
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" serial PRIMARY KEY NOT NULL,
	"repo_id" integer NOT NULL,
	"language" text NOT NULL,
	"bytes" integer DEFAULT 0,
	"fetched_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "languages_repo_id_language_unique" UNIQUE("repo_id","language")
);
--> statement-breakpoint
CREATE TABLE "pull_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"repo_id" integer NOT NULL,
	"github_id" bigint NOT NULL,
	"number" integer NOT NULL,
	"title" text NOT NULL,
	"state" text NOT NULL,
	"merged" boolean DEFAULT false,
	"merged_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	"closed_at" timestamp with time zone,
	"fetched_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "pull_requests_repo_id_github_id_unique" UNIQUE("repo_id","github_id")
);
--> statement-breakpoint
CREATE TABLE "repos" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"github_id" integer NOT NULL,
	"name" text NOT NULL,
	"full_name" text NOT NULL,
	"description" text,
	"language" text,
	"stars" integer DEFAULT 0,
	"forks" integer DEFAULT 0,
	"open_issues" integer DEFAULT 0,
	"has_readme" boolean DEFAULT false,
	"default_branch" text,
	"pushed_at" timestamp with time zone,
	"repo_created_at" timestamp with time zone,
	"repo_updated_at" timestamp with time zone,
	"fetched_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "repos_user_id_github_id_unique" UNIQUE("user_id","github_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"github_id" integer NOT NULL,
	"login" text NOT NULL,
	"name" text,
	"avatar_url" text,
	"access_token" text NOT NULL,
	"last_synced_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "users_github_id_unique" UNIQUE("github_id")
);
--> statement-breakpoint
CREATE TABLE "weekly_summaries" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"week_start" date NOT NULL,
	"week_end" date NOT NULL,
	"summary_text" text NOT NULL,
	"generated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "weekly_summaries_user_id_week_start_unique" UNIQUE("user_id","week_start")
);
--> statement-breakpoint
ALTER TABLE "branches" ADD CONSTRAINT "branches_repo_id_repos_id_fk" FOREIGN KEY ("repo_id") REFERENCES "public"."repos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commits" ADD CONSTRAINT "commits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commits" ADD CONSTRAINT "commits_repo_id_repos_id_fk" FOREIGN KEY ("repo_id") REFERENCES "public"."repos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "languages" ADD CONSTRAINT "languages_repo_id_repos_id_fk" FOREIGN KEY ("repo_id") REFERENCES "public"."repos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pull_requests" ADD CONSTRAINT "pull_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pull_requests" ADD CONSTRAINT "pull_requests_repo_id_repos_id_fk" FOREIGN KEY ("repo_id") REFERENCES "public"."repos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "repos" ADD CONSTRAINT "repos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weekly_summaries" ADD CONSTRAINT "weekly_summaries_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_branches_repo" ON "branches" USING btree ("repo_id");--> statement-breakpoint
CREATE INDEX "idx_commits_user_date" ON "commits" USING btree ("user_id","committed_at");--> statement-breakpoint
CREATE INDEX "idx_commits_repo" ON "commits" USING btree ("repo_id");--> statement-breakpoint
CREATE INDEX "idx_languages_repo" ON "languages" USING btree ("repo_id");--> statement-breakpoint
CREATE INDEX "idx_pull_requests_user_date" ON "pull_requests" USING btree ("user_id","merged_at");--> statement-breakpoint
CREATE INDEX "idx_pull_requests_repo" ON "pull_requests" USING btree ("repo_id");--> statement-breakpoint
CREATE INDEX "idx_repos_user" ON "repos" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_repos_pushed" ON "repos" USING btree ("user_id","pushed_at");--> statement-breakpoint
CREATE INDEX "idx_weekly_summaries_user" ON "weekly_summaries" USING btree ("user_id","week_start");