import type { User } from '../types/models';
import { fetchUserRepos, fetchRepoCommits, fetchRepoLanguages, fetchRepoBranches } from './client';
import { mapGitHubRepo, mapGitHubCommit } from './mappers';
import { upsertRepo, insertCommits, upsertLanguage, upsertBranch, updateLastSyncedAt } from '../db/queries';

const SYNC_COOLDOWN_MS = 6 * 60 * 60 * 1000; // 6 hours

export function needsSync(user: User): boolean {
  if (!user.last_synced_at) return true;
  return Date.now() - new Date(user.last_synced_at).getTime() > SYNC_COOLDOWN_MS;
}

export async function syncUserData(user: User, accessToken: string): Promise<void> {
  const repos = await fetchUserRepos(accessToken);
  const upsertedRepos = await Promise.all(
    repos.map((repo: any) => upsertRepo(mapGitHubRepo(user.id, repo)))
  );

  for (const repo of upsertedRepos) {
    const [owner, name] = [repo.full_name.split('/')[0], repo.name];

    try {
      const commits = await fetchRepoCommits(accessToken, owner, name, user.login);
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
