import { Request, Response, Router } from 'express';
import { fetchBranchesResponseSchema, fetchLanguagesResponseSchema } from '@commitly/schemas';
import { getUserById, getReposByUser, upsertRepo, upsertLanguage, upsertBranch } from '../db/queries';
import { fetchUserRepos, fetchRepoLanguages, fetchRepoBranches, fetchRepoCommitBySha, fetchRepoHasReadme } from '../github/client';
import { mapGitHubRepo } from '../github/mappers';

const reposRouter = Router();

/**
 * GET /fetch — Fetch and upsert user's GitHub repos, return upserted repos
 */
reposRouter.get('/fetch', async (req: Request, res: Response) => {
	const userId = req.session.userId;
	if (!userId) return res.status(401).json({ error: 'Unauthorized' });
	const user = await getUserById(userId);
	if (!user) return res.status(404).json({ error: 'User not found' });
	const repos = await fetchUserRepos(user.access_token);
	const upserted = await Promise.all(repos.map(async (repo: any) => {
		const [owner, repoName] = repo.full_name.split('/');
		const hasReadme = await fetchRepoHasReadme(user.access_token, owner, repoName);
		return upsertRepo(mapGitHubRepo(user.id, repo, hasReadme));
	}));
	res.json(upserted);
});

/**
 * GET /fetch-languages — Fetch and upsert languages for all user repos
 */
reposRouter.get('/fetch-languages', async (req: Request, res: Response) => {
	const userId = req.session.userId;
	if (!userId) return res.status(401).json({ error: 'Unauthorized' });
	const user = await getUserById(userId);
	if (!user) return res.status(404).json({ error: 'User not found' });
	const repos = await getReposByUser(user.id);
	let totalLanguages = 0;
	for (const repo of repos) {
		const langs = await fetchRepoLanguages(user.access_token, repo.full_name.split('/')[0], repo.name);
		for (const [language, bytes] of Object.entries(langs)) {
			await upsertLanguage({ repo_id: repo.id, language, bytes: Number(bytes) });
			totalLanguages++;
		}
	}
	const response = fetchLanguagesResponseSchema.parse({ totalLanguages });
	res.json(response);
});

/**
 * GET /fetch-branches — Fetch and upsert branches for all user repos
 */
reposRouter.get('/fetch-branches', async (req: Request, res: Response) => {
	const userId = req.session.userId;
	if (!userId) return res.status(401).json({ error: 'Unauthorized' });
	const user = await getUserById(userId);
	if (!user) return res.status(404).json({ error: 'User not found' });
	const repos = await getReposByUser(user.id);
	let totalBranches = 0;
	for (const repo of repos) {
		const [owner, repoName] = repo.full_name.split('/');
		const branches = await fetchRepoBranches(user.access_token, owner, repoName);
		for (const branch of branches) {
			let lastCommitDate: Date | null = null;
			if (branch.commit?.sha) {
				const commit = await fetchRepoCommitBySha(user.access_token, owner, repoName, branch.commit.sha);
				const commitDate = commit?.commit?.author?.date ?? commit?.commit?.committer?.date ?? null;
				lastCommitDate = commitDate ? new Date(commitDate) : null;
			}
			await upsertBranch({
				repo_id: repo.id,
				name: branch.name,
				last_commit_sha: branch.commit?.sha ?? null,
				last_commit_date: lastCommitDate,
				is_default: branch.name === repo.default_branch,
			});
			totalBranches++;
		}
	}
	const response = fetchBranchesResponseSchema.parse({ totalBranches });
	res.json(response);
});

reposRouter.get('/active', async (req: Request, res: Response) => {
  // 1. Get user repos
  // 2. Apply freshness filter (< 30 days)
  // 3. If composite: compute activity scores (commits, PRs, branch hygiene)
  // 4. Filter to top N
  // 5. Return with activityScore, status, etc.
})

export default reposRouter;