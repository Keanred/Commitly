import sql from './connection';

export async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id              SERIAL PRIMARY KEY,
      github_id       INTEGER UNIQUE NOT NULL,
      login           TEXT NOT NULL,
      name            TEXT,
      avatar_url      TEXT,
      access_token    TEXT NOT NULL,
      last_synced_at  TIMESTAMPTZ,
      created_at      TIMESTAMPTZ DEFAULT now(),
      updated_at      TIMESTAMPTZ DEFAULT now()
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS repos (
      id              SERIAL PRIMARY KEY,
      user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      github_id       INTEGER NOT NULL,
      name            TEXT NOT NULL,
      full_name       TEXT NOT NULL,
      description     TEXT,
      language        TEXT,
      stars           INTEGER DEFAULT 0,
      forks           INTEGER DEFAULT 0,
      open_issues     INTEGER DEFAULT 0,
      has_readme      BOOLEAN DEFAULT false,
      default_branch  TEXT,
      pushed_at       TIMESTAMPTZ,
      repo_created_at TIMESTAMPTZ,
      repo_updated_at TIMESTAMPTZ,
      fetched_at      TIMESTAMPTZ DEFAULT now(),
      UNIQUE(user_id, github_id)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS commits (
      id              SERIAL PRIMARY KEY,
      user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      repo_id         INTEGER NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
      sha             TEXT NOT NULL,
      message         TEXT,
      additions       INTEGER DEFAULT 0,
      deletions       INTEGER DEFAULT 0,
      committed_at    TIMESTAMPTZ NOT NULL,
      fetched_at      TIMESTAMPTZ DEFAULT now(),
      UNIQUE(repo_id, sha)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS branches (
      id                SERIAL PRIMARY KEY,
      repo_id           INTEGER NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
      name              TEXT NOT NULL,
      last_commit_sha   TEXT,
      last_commit_date  TIMESTAMPTZ,
      is_default        BOOLEAN DEFAULT false,
      fetched_at        TIMESTAMPTZ DEFAULT now(),
      UNIQUE(repo_id, name)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS languages (
      id          SERIAL PRIMARY KEY,
      repo_id     INTEGER NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
      language    TEXT NOT NULL,
      bytes       INTEGER DEFAULT 0,
      fetched_at  TIMESTAMPTZ DEFAULT now(),
      UNIQUE(repo_id, language)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS weekly_summaries (
      id            SERIAL PRIMARY KEY,
      user_id       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      week_start    DATE NOT NULL,
      week_end      DATE NOT NULL,
      summary_text  TEXT NOT NULL,
      generated_at  TIMESTAMPTZ DEFAULT now(),
      UNIQUE(user_id, week_start)
    )
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS pull_requests (
      id              SERIAL PRIMARY KEY,
      user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      repo_id         INTEGER NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
      github_id       BIGINT NOT NULL,
      number          INTEGER NOT NULL,
      title           TEXT NOT NULL,
      state           TEXT NOT NULL,
      merged          BOOLEAN DEFAULT false,
      merged_at       TIMESTAMPTZ,
      created_at      TIMESTAMPTZ NOT NULL,
      closed_at       TIMESTAMPTZ,
      fetched_at      TIMESTAMPTZ DEFAULT now(),
      UNIQUE(repo_id, github_id)
    )
  `;

  // Indexes for common query patterns
  await sql`CREATE INDEX IF NOT EXISTS idx_commits_user_date      ON commits(user_id, committed_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_commits_repo            ON commits(repo_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_repos_user              ON repos(user_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_repos_pushed            ON repos(user_id, pushed_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_branches_repo           ON branches(repo_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_languages_repo          ON languages(repo_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_weekly_summaries_user   ON weekly_summaries(user_id, week_start)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_pull_requests_user_date ON pull_requests(user_id, merged_at)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_pull_requests_repo      ON pull_requests(repo_id)`;

  console.log('Database migrations completed successfully');
}
