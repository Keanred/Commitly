import { Request, Response, NextFunction, Router } from 'express';
import { getUserById, getReposByUser, upsertRepo, upsertLanguage, upsertBranch } from '../db/queries';
import { fetchUserRepos, fetchRepoLanguages, fetchRepoBranches } from '../github/client';

const reposRouter = Router();

/**
 * GET /fetch — Fetch and upsert user's GitHub repos, return upserted repos
 * Requires req.session.userId to be set (auth middleware)
 */
reposRouter.get('/fetch', async (req: Request, res: Response) => {
	try {
		const userId = req.session.userId;
		if (!userId) return res.status(401).json({ error: 'Unauthorized' });
		const user = await getUserById(userId);
		if (!user) return res.status(404).json({ error: 'User not found' });
		const repos = await fetchUserRepos(user.access_token);
		// Upsert each repo into DB
		const upserted = await Promise.all(
			repos.map(async (repo: any) => {
				return upsertRepo({
					user_id: user.id,
					github_id: repo.id,
					name: repo.name,
					full_name: repo.full_name,
					description: repo.description,
					language: repo.language,
					stars: repo.stargazers_count,
					forks: repo.forks_count,
					open_issues: repo.open_issues_count,
					has_readme: false, // can be updated later
					default_branch: repo.default_branch,
					pushed_at: repo.pushed_at ? new Date(repo.pushed_at) : null,
					repo_created_at: repo.created_at ? new Date(repo.created_at) : null,
					repo_updated_at: repo.updated_at ? new Date(repo.updated_at) : null,
				});
			})
		);
		res.json(upserted);
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

export default reposRouter;

/**
 * GET /fetch-languages — Fetch and upsert languages for all user repos
 * Requires req.session.userId to be set (auth middleware)
 */
reposRouter.get('/fetch-languages', async (req: Request, res: Response) => {
	try {
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
		res.json({ totalLanguages });
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

/**
 * GET /fetch-branches — Fetch and upsert branches for all user repos
 * Requires req.session.userId to be set (auth middleware)
 */
reposRouter.get('/fetch-branches', async (req: Request, res: Response) => {
	try {
		const userId = req.session.userId;
		if (!userId) return res.status(401).json({ error: 'Unauthorized' });
		const user = await getUserById(userId);
		if (!user) return res.status(404).json({ error: 'User not found' });
		const repos = await getReposByUser(user.id);
		let totalBranches = 0;
		for (const repo of repos) {
			const branches = await fetchRepoBranches(user.access_token, repo.full_name.split('/')[0], repo.name);
			for (const branch of branches) {
				await upsertBranch({
					repo_id: repo.id,
					name: branch.name,
					last_commit_sha: branch.commit?.sha ?? null,
					last_commit_date: null, // can be updated with extra API call if needed
					is_default: branch.name === repo.default_branch,
				});
				totalBranches++;
			}
		}
		res.json({ totalBranches });
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});