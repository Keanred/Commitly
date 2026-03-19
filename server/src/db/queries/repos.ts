import sql from '../connection';
import type { Repo, RepoInsert } from '../../types/models';

export async function getReposByUser(userId: number): Promise<Repo[]> {
  return sql<Repo[]>`SELECT * FROM repos WHERE user_id = ${userId}`;
}

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
