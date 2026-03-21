import type { User } from '../types/models';
import { fetchUserRepos, fetchRepoCommits, fetchRepoLanguages, fetchRepoBranches } from './client';
import { mapGitHubRepo, mapGitHubCommit } from './mappers';
import { upsertRepo, insertCommits, upsertLanguage, upsertBranch, updateLastSyncedAt } from '../db/queries';
import cfg from '../config';

export function needsSync(user: User): boolean {
  if (!user.last_synced_at) return true;
  return Date.now() - new Date(user.last_synced_at).getTime() > cfg.github.syncCooldownMs;
}

export async function syncUserData(user: User, accessToken: string): Promise<void> {
  const repos = await fetchUserRepos(accessToken);
  const upsertedRepos = await Promise.all(
    repos.map((repo: any) => upsertRepo(mapGitHubRepo(user.id, repo)))
  );

  // Limit commit sync to ~13 months to cover all dashboard timeframes (max: 52-week history)
  const sinceDate = new Date();
  sinceDate.setMonth(sinceDate.getMonth() - 13);
  const since = sinceDate.toISOString();

  for (const repo of upsertedRepos) {
    const [owner, name] = [repo.full_name.split('/')[0], repo.name];

    try {
      const commits = await fetchRepoCommits(accessToken, owner, name, user.login, since);
      await insertCommits(commits.map((c: any) => mapGitHubCommit(user.id, repo.id, c)));
    } catch (err) {
      console.error(`Failed to sync commits for ${repo.full_name}:`, err);
    }

    try {
      const langs = await fetchRepoLanguages(accessToken, owner, name);
      for (const [language, bytes] of Object.entries(langs)) {
        await upsertLanguage({ repo_id: repo.id, language, bytes: Number(bytes) });
      }
    } catch (err) {
      console.error(`Failed to sync languages for ${repo.full_name}:`, err);
    }

    try {
      const branches = await fetchRepoBranches(accessToken, owner, name);
      for (const branch of branches) {
        await upsertBranch({
          repo_id: repo.id,
          name: branch.name,
          last_commit_sha: branch.commit?.sha ?? null,
          last_commit_date: null,
          is_default: branch.name === repo.default_branch,
        });
      }
    } catch (err) {
      console.error(`Failed to sync branches for ${repo.full_name}:`, err);
    }
  }

  await updateLastSyncedAt(user.id);
}
