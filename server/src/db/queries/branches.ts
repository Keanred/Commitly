import sql from '../connection';
import type { Branch, BranchInsert } from '../../types/models';

export async function getBranchesByRepo(repoId: number): Promise<Branch[]> {
  return sql<Branch[]>`SELECT * FROM branches WHERE repo_id = ${repoId}`;
}

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
