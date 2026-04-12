import cfg from '../config';
import {
  getCommitsByUser,
  getUserById,
  insertCommits,
  insertPullRequests,
  pruneCommits,
  prunePullRequests,
  updateLastSyncedAt,
  updateLongestStreak,
  upsertBranch,
  upsertLanguage,
  upsertRepo,
} from '../db/queries';
import { computeStreak } from '../metrics/streakHelper';
import type { User } from '../types/models';
import {
  fetchRepoBranches,
  fetchRepoCommitBySha,
  fetchRepoCommits,
  fetchRepoHasReadme,
  fetchRepoLanguages,
  fetchRepoPullRequests,
  fetchUserRepos,
} from './client';
import { mapGitHubCommit, mapGitHubPullRequest, mapGitHubRepo } from './mappers';

export function needsSync(user: User): boolean {
  if (!user.last_synced_at) return true;
  return Date.now() - new Date(user.last_synced_at).getTime() > cfg.github.syncCooldownMs;
}

// eslint-disable-next-line complexity
export async function syncUserData(user: User, accessToken: string): Promise<void> {
  const repos = await fetchUserRepos(accessToken);
  const upsertedRepos = await Promise.all(
    repos.map(async (repo) => {
      const [owner, repoName] = repo.full_name.split('/');
      const hasReadme = await fetchRepoHasReadme(accessToken, owner, repoName);
      return upsertRepo(mapGitHubRepo(user.id, repo, hasReadme));
    }),
  );

  // Limit commit sync to ~13 months to cover all dashboard timeframes (max: 52-week history)
  const sinceDate = new Date();
  sinceDate.setMonth(sinceDate.getMonth() - 13);
  const since = sinceDate.toISOString();

  for (const repo of upsertedRepos) {
    const [owner, name] = [repo.full_name.split('/')[0], repo.name];

    try {
      const commits = await fetchRepoCommits(accessToken, owner, name, user.login, since);
      await insertCommits(commits.map((commit) => mapGitHubCommit(user.id, repo.id, commit)));
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
        let lastCommitDate: Date | null = null;
        if (branch.commit?.sha) {
          const commit = await fetchRepoCommitBySha(accessToken, owner, name, branch.commit.sha);
          const commitDate = commit?.commit?.author?.date ?? commit?.commit?.committer?.date ?? null;
          lastCommitDate = commitDate ? new Date(commitDate) : null;
        }
        await upsertBranch({
          repo_id: repo.id,
          name: branch.name,
          last_commit_date: lastCommitDate,
          is_default: branch.name === repo.default_branch,
        });
      }
    } catch (err) {
      console.error(`Failed to sync branches for ${repo.full_name}:`, err);
    }

    try {
      const prs = await fetchRepoPullRequests(accessToken, owner, name, 'all', since);
      await insertPullRequests(prs.map((pr) => mapGitHubPullRequest(user.id, repo.id, pr)));
    } catch (err) {
      console.error(`Failed to sync pull requests for ${repo.full_name}:`, err);
    }
  }

  await updateLastSyncedAt(user.id);

  // Persist longest streak before pruning so historical record is never lost
  const allCommits = await getCommitsByUser(user.id);
  const { longestStreak } = computeStreak(allCommits);
  const currentUser = await getUserById(user.id);
  if (longestStreak > (currentUser?.longest_streak ?? 0)) {
    await updateLongestStreak(user.id, longestStreak);
  }

  // Prune rows outside the 13-month retention window
  const cutoffDate = new Date();
  cutoffDate.setMonth(cutoffDate.getMonth() - 13);
  await Promise.all([pruneCommits(user.id, cutoffDate), prunePullRequests(user.id, cutoffDate)]);
}
