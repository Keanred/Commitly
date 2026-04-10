import { bigint, boolean, date, index, integer, pgTable, serial, text, timestamp, unique } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  github_id: integer('github_id').notNull().unique(),
  login: text('login').notNull(),
  name: text('name'),
  avatar_url: text('avatar_url'),
  access_token: text('access_token').notNull(),
  longest_streak: integer('longest_streak').default(0).notNull(),
  last_synced_at: timestamp('last_synced_at', { withTimezone: true }),
  created_at: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updated_at: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const repos = pgTable(
  'repos',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    github_id: integer('github_id').notNull(),
    name: text('name').notNull(),
    full_name: text('full_name').notNull(),
    description: text('description'),
    language: text('language'),
    stars: integer('stars').default(0).notNull(),
    forks: integer('forks').default(0).notNull(),
    open_issues: integer('open_issues').default(0).notNull(),
    has_readme: boolean('has_readme').default(false).notNull(),
    default_branch: text('default_branch'),
    pushed_at: timestamp('pushed_at', { withTimezone: true }),
    repo_created_at: timestamp('repo_created_at', { withTimezone: true }),
    repo_updated_at: timestamp('repo_updated_at', { withTimezone: true }),
    fetched_at: timestamp('fetched_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    reposUserGithubUnique: unique().on(table.user_id, table.github_id),
    idxReposUser: index('idx_repos_user').on(table.user_id),
    idxReposPushed: index('idx_repos_pushed').on(table.user_id, table.pushed_at),
  }),
);

export const commits = pgTable(
  'commits',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    repo_id: integer('repo_id')
      .references(() => repos.id, { onDelete: 'cascade' })
      .notNull(),
    sha: text('sha').notNull(),
    message: text('message'),
    additions: integer('additions').default(0).notNull(),
    deletions: integer('deletions').default(0).notNull(),
    committed_at: timestamp('committed_at', { withTimezone: true }).notNull(),
    fetched_at: timestamp('fetched_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    commitsRepoShaUnique: unique().on(table.repo_id, table.sha),
    idxCommitsUserDate: index('idx_commits_user_date').on(table.user_id, table.committed_at),
    idxCommitsRepo: index('idx_commits_repo').on(table.repo_id),
  }),
);

export const branches = pgTable(
  'branches',
  {
    id: serial('id').primaryKey(),
    repo_id: integer('repo_id')
      .references(() => repos.id, { onDelete: 'cascade' })
      .notNull(),
    name: text('name').notNull(),
    last_commit_date: timestamp('last_commit_date', { withTimezone: true }),
    is_default: boolean('is_default').default(false).notNull(),
    fetched_at: timestamp('fetched_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    branchesRepoNameUnique: unique().on(table.repo_id, table.name),
    idxBranchesRepo: index('idx_branches_repo').on(table.repo_id),
  }),
);

export const languages = pgTable(
  'languages',
  {
    id: serial('id').primaryKey(),
    repo_id: integer('repo_id')
      .references(() => repos.id, { onDelete: 'cascade' })
      .notNull(),
    language: text('language').notNull(),
    bytes: integer('bytes').default(0).notNull(),
    fetched_at: timestamp('fetched_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    languagesRepoLanguageUnique: unique().on(table.repo_id, table.language),
    idxLanguagesRepo: index('idx_languages_repo').on(table.repo_id),
  }),
);

export const weeklySummaries = pgTable(
  'weekly_summaries',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    week_start: date('week_start').notNull(),
    week_end: date('week_end').notNull(),
    summary_text: text('summary_text').notNull(),
    generated_at: timestamp('generated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    weeklySummariesUserWeekUnique: unique().on(table.user_id, table.week_start),
    idxWeeklySummariesUser: index('idx_weekly_summaries_user').on(table.user_id, table.week_start),
  }),
);

export const pullRequests = pgTable(
  'pull_requests',
  {
    id: serial('id').primaryKey(),
    user_id: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    repo_id: integer('repo_id')
      .references(() => repos.id, { onDelete: 'cascade' })
      .notNull(),
    github_id: bigint('github_id', { mode: 'number' }).notNull(),
    number: integer('number').notNull(),
    title: text('title').notNull(),
    state: text('state').notNull(),
    merged: boolean('merged').default(false).notNull(),
    merged_at: timestamp('merged_at', { withTimezone: true }),
    created_at: timestamp('created_at', { withTimezone: true }).notNull(),
    closed_at: timestamp('closed_at', { withTimezone: true }),
    fetched_at: timestamp('fetched_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    pullRequestsRepoGithubUnique: unique().on(table.repo_id, table.github_id),
    idxPullRequestsUserDate: index('idx_pull_requests_user_date').on(table.user_id, table.merged_at),
    idxPullRequestsRepo: index('idx_pull_requests_repo').on(table.repo_id),
  }),
);
