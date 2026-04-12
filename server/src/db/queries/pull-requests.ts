import { and, eq, gte, lt, sql } from 'drizzle-orm';
import type { PullRequest, PullRequestInsert } from '../../types/models';
import { db } from '../connection';
import { pullRequests } from '../schema';

export async function getPullRequestsByUser(userId: number, since?: Date): Promise<PullRequest[]> {
  if (since) {
    return db
      .select()
      .from(pullRequests)
      .where(and(eq(pullRequests.user_id, userId), gte(pullRequests.created_at, since)));
  }
  return db.select().from(pullRequests).where(eq(pullRequests.user_id, userId));
}

export async function prunePullRequests(userId: number, cutoffDate: Date): Promise<void> {
  await db.delete(pullRequests).where(and(eq(pullRequests.user_id, userId), lt(pullRequests.created_at, cutoffDate)));
}

export async function insertPullRequests(prs: PullRequestInsert[]): Promise<void> {
  if (prs.length === 0) {
    return;
  }

  await db
    .insert(pullRequests)
    .values(
      prs.map((pr) => ({
        user_id: pr.user_id,
        repo_id: pr.repo_id,
        github_id: pr.github_id,
        number: pr.number,
        title: pr.title,
        state: pr.state,
        merged: pr.merged,
        merged_at: pr.merged_at,
        created_at: pr.created_at,
        closed_at: pr.closed_at,
        fetched_at: new Date(),
      })),
    )
    .onConflictDoUpdate({
      target: [pullRequests.repo_id, pullRequests.github_id],
      set: {
        title: sql`excluded.title`,
        state: sql`excluded.state`,
        merged: sql`excluded.merged`,
        merged_at: sql`excluded.merged_at`,
        closed_at: sql`excluded.closed_at`,
        fetched_at: new Date(),
      },
    });
}
