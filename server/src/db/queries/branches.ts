import { eq, sql } from 'drizzle-orm';
import type { Branch, BranchInsert } from '../../types/models';
import { db } from '../connection';
import { branches } from '../schema';

export async function getBranchesByRepo(repoId: number): Promise<Branch[]> {
  return db.select().from(branches).where(eq(branches.repo_id, repoId));
}

export async function upsertBranch(branch: BranchInsert): Promise<Branch> {
  const [result] = await db
    .insert(branches)
    .values({
      repo_id: branch.repo_id,
      name: branch.name,
      last_commit_date: branch.last_commit_date ?? null,
      is_default: branch.is_default,
      fetched_at: sql`now()`,
    })
    .onConflictDoUpdate({
      target: [branches.repo_id, branches.name],
      set: {
        last_commit_date: branch.last_commit_date ?? null,
        is_default: branch.is_default,
        fetched_at: sql`now()`,
      },
    })
    .returning();

  if (!result) {
    throw new Error('Failed to upsert branch');
  }

  return result;
}
