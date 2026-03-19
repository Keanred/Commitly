import sql from '../connection';
import type { Commit, CommitInsert } from '../../types/models';

export async function getCommitsByRepo(repoId: number): Promise<Commit[]> {
  return sql<Commit[]>`SELECT * FROM commits WHERE repo_id = ${repoId}`;
}

export async function getCommitsByUser(userId: number): Promise<Commit[]> {
  return sql<Commit[]>`SELECT * FROM commits WHERE user_id = ${userId}`;
}

export async function insertCommits(commits: CommitInsert[]): Promise<void> {
  if (commits.length === 0) return;
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
