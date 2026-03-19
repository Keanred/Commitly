import { Request, Response, NextFunction, Router } from 'express';
import { getUserById, getReposByUser, insertCommits } from '../db/queries';
import { fetchRepoCommits } from '../github/client';

const commitsRouter = Router();

/**
 * GET /fetch — Fetch and upsert user's GitHub repo commits, return count
 * Requires req.session.userId to be set (auth middleware)
 */
commitsRouter.get('/fetch', async (req: Request, res: Response) => {
	try {
		const userId = req.session.userId;
		if (!userId) return res.status(401).json({ error: 'Unauthorized' });
		const user = await getUserById(userId);
		if (!user) return res.status(404).json({ error: 'User not found' });
		const repos = await getReposByUser(user.id);
		let totalCommits = 0;
		for (const repo of repos) {
			// Fetch commits for this repo authored by the user
			const commits = await fetchRepoCommits(user.access_token, repo.full_name.split('/')[0], repo.name, user.login);
			// Map GitHub commit data to CommitInsert[]
			const commitInserts = commits.map((commit: any) => ({
				user_id: user.id,
				repo_id: repo.id,
				sha: commit.sha,
				message: commit.commit?.message ?? '',
				additions: commit.stats?.additions ?? 0,
				deletions: commit.stats?.deletions ?? 0,
				committed_at: commit.commit?.author?.date ? new Date(commit.commit.author.date) : new Date(),
			}));
			await insertCommits(commitInserts);
			totalCommits += commitInserts.length;
		}
		res.json({ totalCommits });
	} catch (err: any) {
		res.status(500).json({ error: err.message });
	}
});

export default commitsRouter;