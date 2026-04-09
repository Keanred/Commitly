import { eq, sql } from 'drizzle-orm';
import { db } from '../connection';
import { repos } from '../schema';
import type { Repo, RepoInsert } from '../../types/models';

export async function getReposByUser(userId: number): Promise<Repo[]> {
  return db.select().from(repos).where(eq(repos.user_id, userId));
}

export async function upsertRepo(repo: RepoInsert): Promise<Repo> {
  const [result] = await db
    .insert(repos)
    .values({
      user_id: repo.user_id,
      github_id: repo.github_id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      language: repo.language,
      stars: repo.stars,
      forks: repo.forks,
      open_issues: repo.open_issues,
      has_readme: repo.has_readme,
      default_branch: repo.default_branch,
      pushed_at: repo.pushed_at,
      repo_created_at: repo.repo_created_at,
      repo_updated_at: repo.repo_updated_at,
      fetched_at: sql`now()`,
    })
    .onConflictDoUpdate({
      target: [repos.user_id, repos.github_id],
      set: {
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description,
        language: repo.language,
        stars: repo.stars,
        forks: repo.forks,
        open_issues: repo.open_issues,
        has_readme: repo.has_readme,
        default_branch: repo.default_branch,
        pushed_at: repo.pushed_at,
        repo_created_at: repo.repo_created_at,
        repo_updated_at: repo.repo_updated_at,
        fetched_at: sql`now()`,
      },
    })
    .returning();

  if (!result) {
    throw new Error('Failed to upsert repo');
  }

  return result;
}
