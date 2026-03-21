import sql from '../connection';
import type { PullRequest, PullRequestInsert } from '../../types/models';

export async function getPullRequestsByUser(userId: number): Promise<PullRequest[]> {
  return sql<PullRequest[]>`SELECT * FROM pull_requests WHERE user_id = ${userId}`;
}

export async function insertPullRequests(prs: PullRequestInsert[]): Promise<void> {
  if (prs.length === 0) return;
  const rows = prs.map(pr => [
    pr.user_id,
    pr.repo_id,
    pr.github_id,
    pr.number,
    pr.title,
    pr.state,
    pr.merged,
    pr.merged_at ? (pr.merged_at instanceof Date ? pr.merged_at.toISOString() : pr.merged_at) : null,
    pr.created_at instanceof Date ? pr.created_at.toISOString() : pr.created_at,
    pr.closed_at ? (pr.closed_at instanceof Date ? pr.closed_at.toISOString() : pr.closed_at) : null,
    new Date().toISOString()
  ]);
  await sql`
    INSERT INTO pull_requests (user_id, repo_id, github_id, number, title, state, merged, merged_at, created_at, closed_at, fetched_at)
    ${sql(rows)}
    ON CONFLICT (repo_id, github_id) DO UPDATE SET
      title = EXCLUDED.title,
      state = EXCLUDED.state,
      merged = EXCLUDED.merged,
      merged_at = EXCLUDED.merged_at,
      closed_at = EXCLUDED.closed_at,
      fetched_at = EXCLUDED.fetched_at
  `;
}
