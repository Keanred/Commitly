import { Request, Response, Router } from 'express';
import { getUserById, getReposByUser, insertCommits } from '../db/queries';
import { fetchRepoCommits } from '../github/client';
import { mapGitHubCommit } from '../github/mappers';

const commitsRouter = Router();

/**
 * GET /fetch — Fetch and upsert user's GitHub repo commits, return count
 */
commitsRouter.get('/fetch', async (req: Request, res: Response) => {
	const userId = req.session.userId;
	if (!userId) return res.status(401).json({ error: 'Unauthorized' });
	const user = await getUserById(userId);
	if (!user) return res.status(404).json({ error: 'User not found' });
	const repos = await getReposByUser(user.id);
	let totalCommits = 0;
	for (const repo of repos) {
		const commits = await fetchRepoCommits(user.access_token, repo.full_name.split('/')[0], repo.name, user.login);
		const commitInserts = commits.map((commit: any) => mapGitHubCommit(user.id, repo.id, commit));
		await insertCommits(commitInserts);
		totalCommits += commitInserts.length;
	}
	res.json({ totalCommits });
});

export default commitsRouter;