import { eq } from 'drizzle-orm';
import { db } from '../connection';
import { commits as commitsTable } from '../schema';
import type { Commit, CommitInsert } from '../../types/models';

export async function getCommitsByRepo(repoId: number): Promise<Commit[]> {
  return db.select().from(commitsTable).where(eq(commitsTable.repo_id, repoId));
}

export async function getCommitsByUser(userId: number): Promise<Commit[]> {
  return db.select().from(commitsTable).where(eq(commitsTable.user_id, userId));
}

export async function insertCommits(commits: CommitInsert[]): Promise<void> {
  if (commits.length === 0) {
    return;
  }

  await db
    .insert(commitsTable)
    .values(
      commits.map((commit) => ({
        user_id: commit.user_id,
        repo_id: commit.repo_id,
        sha: commit.sha,
        message: commit.message ?? '',
        additions: commit.additions,
        deletions: commit.deletions,
        committed_at: commit.committed_at,
        fetched_at: new Date(),
      })),
    )
    .onConflictDoNothing({ target: [commitsTable.repo_id, commitsTable.sha] });
}
