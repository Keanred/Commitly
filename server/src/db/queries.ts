import sql from './connection';
import type {
  User,
  Repo,
  Commit,
  Branch,
  Language,
  WeeklySummary,
  UserInsert,
  RepoInsert,
  CommitInsert,
  BranchInsert,
  LanguageInsert
} from '../types/models';

// USERS

/**
 * Fetch a user by their internal user ID.
 * @param id Internal user ID
 * @returns User object or null if not found
 */
export async function getUserById(id: number): Promise<User | null> {
  const [user] = await sql<User[]>`SELECT * FROM users WHERE id = ${id}`;
  return user || null;
}

/**
 * Fetch a user by their GitHub user ID.
 * @param githubId GitHub user ID
 * @returns User object or null if not found
 */
export async function getUserByGithubId(githubId: number): Promise<User | null> {
  const [user] = await sql<User[]>`SELECT * FROM users WHERE github_id = ${githubId}`;
  return user || null;
}

/**
 * Insert or update a user in the database by GitHub ID.
 * @param user UserInsert object (no id, created_at, updated_at)
 * @returns The upserted User object
 */
export async function upsertUser(user: UserInsert): Promise<User> {
  const [result] = await sql<User[]>`
    INSERT INTO users (github_id, login, name, avatar_url, access_token)
    VALUES (${user.github_id}, ${user.login}, ${user.name}, ${user.avatar_url}, ${user.access_token})
    ON CONFLICT (github_id) DO UPDATE SET
      login = EXCLUDED.login,
      name = EXCLUDED.name,
      avatar_url = EXCLUDED.avatar_url,
      access_token = EXCLUDED.access_token,
      updated_at = now()
    RETURNING *
  `;
  return result;
}

// REPOS

/**
 * Fetch all repositories for a given user.
 * @param userId Internal user ID
 * @returns Array of Repo objects
 */
export async function getReposByUser(userId: number): Promise<Repo[]> {
  return sql<Repo[]>`SELECT * FROM repos WHERE user_id = ${userId}`;
}

/**
 * Insert or update a repository for a user.
 * @param repo RepoInsert object (no id, fetched_at)
 * @returns The upserted Repo object
 */
export async function upsertRepo(repo: RepoInsert): Promise<Repo> {
  const [result] = await sql<Repo[]>`
    INSERT INTO repos (user_id, github_id, name, full_name, description, language, stars, forks, open_issues, has_readme, default_branch, pushed_at, repo_created_at, repo_updated_at, fetched_at)
    VALUES (${repo.user_id}, ${repo.github_id}, ${repo.name}, ${repo.full_name}, ${repo.description}, ${repo.language}, ${repo.stars}, ${repo.forks}, ${repo.open_issues}, ${repo.has_readme}, ${repo.default_branch}, ${repo.pushed_at}, ${repo.repo_created_at}, ${repo.repo_updated_at}, now())
    ON CONFLICT (user_id, github_id) DO UPDATE SET
      name = EXCLUDED.name,
      full_name = EXCLUDED.full_name,
      description = EXCLUDED.description,
      language = EXCLUDED.language,
      stars = EXCLUDED.stars,
      forks = EXCLUDED.forks,
      open_issues = EXCLUDED.open_issues,
      has_readme = EXCLUDED.has_readme,
      default_branch = EXCLUDED.default_branch,
      pushed_at = EXCLUDED.pushed_at,
      repo_created_at = EXCLUDED.repo_created_at,
      repo_updated_at = EXCLUDED.repo_updated_at,
      fetched_at = now()
    RETURNING *
  `;
  return result;
}

// COMMITS

/**
 * Fetch all commits for a given repository.
 * @param repoId Internal repo ID
 * @returns Array of Commit objects
 */
export async function getCommitsByRepo(repoId: number): Promise<Commit[]> {
  return sql<Commit[]>`SELECT * FROM commits WHERE repo_id = ${repoId}`;
}

/**
 * Bulk insert commits for a repo. Ignores duplicates by (repo_id, sha).
 * @param commits Array of CommitInsert objects (no id, fetched_at)
 */
export async function insertCommits(commits: CommitInsert[]): Promise<void> {
  if (commits.length === 0) return;
  // Convert Date fields to ISO strings for postgres bulk insert
  const rows = commits.map(commit => [
    commit.user_id,
    commit.repo_id,
    commit.sha,
    commit.message ?? '',
    commit.additions,
    commit.deletions,
    commit.committed_at instanceof Date ? commit.committed_at.toISOString() : commit.committed_at,
    new Date().toISOString()
  ]);
  await sql`
    INSERT INTO commits (user_id, repo_id, sha, message, additions, deletions, committed_at, fetched_at)
    ${sql(rows)}
    ON CONFLICT (repo_id, sha) DO NOTHING
  `;
}

// BRANCHES

/**
 * Fetch all branches for a given repository.
 * @param repoId Internal repo ID
 * @returns Array of Branch objects
 */
export async function getBranchesByRepo(repoId: number): Promise<Branch[]> {
  return sql<Branch[]>`SELECT * FROM branches WHERE repo_id = ${repoId}`;
}

/**
 * Insert or update a branch for a repo.
 * @param branch BranchInsert object (no id, fetched_at)
 * @returns The upserted Branch object
 */
export async function upsertBranch(branch: BranchInsert): Promise<Branch> {
  const [result] = await sql<Branch[]>`
    INSERT INTO branches (repo_id, name, last_commit_sha, last_commit_date, is_default, fetched_at)
    VALUES (${branch.repo_id}, ${branch.name}, ${branch.last_commit_sha ?? null}, ${branch.last_commit_date ?? null}, ${branch.is_default}, now())
    ON CONFLICT (repo_id, name) DO UPDATE SET
      last_commit_sha = EXCLUDED.last_commit_sha,
      last_commit_date = EXCLUDED.last_commit_date,
      is_default = EXCLUDED.is_default,
      fetched_at = now()
    RETURNING *
  `;
  return result;
}

// LANGUAGES

/**
 * Fetch all language breakdowns for a given repository.
 * @param repoId Internal repo ID
 * @returns Array of Language objects
 */
export async function getLanguagesByRepo(repoId: number): Promise<Language[]> {
  return sql<Language[]>`SELECT * FROM languages WHERE repo_id = ${repoId}`;
}

/**
 * Insert or update a language breakdown for a repo.
 * @param language LanguageInsert object (no id, fetched_at)
 * @returns The upserted Language object
 */
export async function upsertLanguage(language: LanguageInsert): Promise<Language> {
  const [result] = await sql<Language[]>`
    INSERT INTO languages (repo_id, language, bytes, fetched_at)
    VALUES (${language.repo_id}, ${language.language}, ${language.bytes}, now())
    ON CONFLICT (repo_id, language) DO UPDATE SET
      bytes = EXCLUDED.bytes,
      fetched_at = now()
    RETURNING *
  `;
  return result;
}

// WEEKLY SUMMARIES

/**
 * Fetch a weekly summary for a user and week.
 * @param userId Internal user ID
 * @param weekStart Start date of the week (YYYY-MM-DD)
 * @returns WeeklySummary object or null if not found
 */
export async function getWeeklySummary(userId: number, weekStart: Date): Promise<WeeklySummary | null> {
  const [summary] = await sql<WeeklySummary[]>`SELECT * FROM weekly_summaries WHERE user_id = ${userId} AND week_start = ${weekStart}`;
  return summary || null;
}

/**
 * Insert or update a weekly summary for a user and week.
 * @param summary WeeklySummary object (omit id, generated_at)
 * @returns The upserted WeeklySummary object
 */
export async function upsertWeeklySummary(summary: Omit<WeeklySummary, 'id' | 'generated_at'>): Promise<WeeklySummary> {
  const [result] = await sql<WeeklySummary[]>`
    INSERT INTO weekly_summaries (user_id, week_start, week_end, summary_text, generated_at)
    VALUES (${summary.user_id}, ${summary.week_start}, ${summary.week_end}, ${summary.summary_text}, now())
    ON CONFLICT (user_id, week_start) DO UPDATE SET
      week_end = EXCLUDED.week_end,
      summary_text = EXCLUDED.summary_text,
      generated_at = now()
    RETURNING *
  `;
  return result;
}
