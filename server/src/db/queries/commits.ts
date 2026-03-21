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
  const rows = commits.map(commit => ({
    user_id: commit.user_id,
    repo_id: commit.repo_id,
    sha: commit.sha,
    message: commit.message ?? '',
    additions: commit.additions,
    deletions: commit.deletions,
    committed_at: commit.committed_at instanceof Date ? commit.committed_at.toISOString() : commit.committed_at,
    fetched_at: new Date().toISOString()
  }));
  await sql`
    INSERT INTO commits ${sql(rows, 'user_id', 'repo_id', 'sha', 'message', 'additions', 'deletions', 'committed_at', 'fetched_at')}
    ON CONFLICT (repo_id, sha) DO NOTHING
  `;
}
