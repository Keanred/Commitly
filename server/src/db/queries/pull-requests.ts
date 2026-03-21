import sql from '../connection';
import type { PullRequest, PullRequestInsert } from '../../types/models';

export async function getPullRequestsByUser(userId: number): Promise<PullRequest[]> {
  return sql<PullRequest[]>`SELECT * FROM pull_requests WHERE user_id = ${userId}`;
}

export async function insertPullRequests(prs: PullRequestInsert[]): Promise<void> {
  if (prs.length === 0) return;
  const rows = prs.map(pr => ({
    user_id: pr.user_id,
    repo_id: pr.repo_id,
    github_id: pr.github_id,
    number: pr.number,
    title: pr.title,
    state: pr.state,
    merged: pr.merged,
    merged_at: pr.merged_at ? (pr.merged_at instanceof Date ? pr.merged_at.toISOString() : pr.merged_at) : null,
    created_at: pr.created_at instanceof Date ? pr.created_at.toISOString() : pr.created_at,
    closed_at: pr.closed_at ? (pr.closed_at instanceof Date ? pr.closed_at.toISOString() : pr.closed_at) : null,
    fetched_at: new Date().toISOString()
  }));
  await sql`
    INSERT INTO pull_requests ${sql(rows, 'user_id', 'repo_id', 'github_id', 'number', 'title', 'state', 'merged', 'merged_at', 'created_at', 'closed_at', 'fetched_at')}
    ON CONFLICT (repo_id, github_id) DO UPDATE SET
      title = EXCLUDED.title,
      state = EXCLUDED.state,
      merged = EXCLUDED.merged,
      merged_at = EXCLUDED.merged_at,
      closed_at = EXCLUDED.closed_at,
      fetched_at = EXCLUDED.fetched_at
  `;
}
