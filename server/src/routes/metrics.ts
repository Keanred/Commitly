import { Router, Request, Response } from 'express';
import { getCommitsByUser, getLanguagesByRepo, getBranchesByRepo, getReposByUser } from '../db/queries';
import type { Branch } from '../types/models';

const metricsRouter = Router();

metricsRouter.get('/commits/streak', async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const allCommits = await getCommitsByUser(userId);
  const commitDates = Array.from(new Set(allCommits.map(commit => commit.committed_at.toISOString().split('T')[0]))).sort();

  let currentStreak = 0;
  let longestStreak = 0;
  let previousDate: string | null = null;

  for (const date of commitDates) {
    if (previousDate) {
      const diffDays = (new Date(date).getTime() - new Date(previousDate).getTime()) / (1000 * 60 * 60 * 24);
      if (diffDays === 1) {
        currentStreak++;
      } else if (diffDays > 1) {
        longestStreak = Math.max(longestStreak, currentStreak);
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    previousDate = date;
  }
  longestStreak = Math.max(longestStreak, currentStreak);

  res.json({ streak: longestStreak });
});

metricsRouter.get('/commits/by-hour', async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const allCommits = await getCommitsByUser(userId);
  const hourCounts: { [hour: number]: number } = {};
  for (let i = 0; i < 24; i++) {
    hourCounts[i] = 0;
  }
  for (const commit of allCommits) {
    const hour = new Date(commit.committed_at).getHours();
    hourCounts[hour]++;
  }

  res.json({ commitByHour: hourCounts });
});

metricsRouter.get('/commits/by-day', async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const allCommits = await getCommitsByUser(userId);
  const dayCounts: { [day: number]: number } = {};
  for (let i = 0; i < 7; i++) {
    dayCounts[i] = 0;
  }
  for (const commit of allCommits) {
    const day = new Date(commit.committed_at).getDay();
    dayCounts[day]++;
  }
  res.json({ commitByDay: dayCounts });
});

metricsRouter.get('/commits/history', async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const allCommits = await getCommitsByUser(userId);
  const today = new Date();
  const pastDate = new Date(today.getTime() - 52 * 7 * 24 * 60 * 60 * 1000);
  const dateCounts: { [date: string]: number } = {};
  for (const commit of allCommits) {
    const commitDate = new Date(commit.committed_at);
    if (commitDate >= pastDate) {
      const dateKey = commitDate.toISOString().split('T')[0];
      dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
    }
  }

  res.json({ commitHistory: dateCounts });
});

metricsRouter.get('/commits/weekly', async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const allCommits = await getCommitsByUser(userId);
  const today = new Date();
  const startOfWeek = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
  const startOfLastWeek = new Date(startOfWeek.getTime() - 7 * 24 * 60 * 60 * 1000);

  let thisWeekCount = 0;
  let lastWeekCount = 0;

  for (const commit of allCommits) {
    const commitDate = new Date(commit.committed_at);
    if (commitDate >= startOfWeek) {
      thisWeekCount++;
    } else if (commitDate >= startOfLastWeek && commitDate < startOfWeek) {
      lastWeekCount++;
    }
  }

  const delta = thisWeekCount - lastWeekCount;
  res.json({ thisWeek: thisWeekCount, lastWeek: lastWeekCount, delta });
});

metricsRouter.get('/repos', async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const repos = await getReposByUser(userId);
  const repoHealth = repos.map(repo => {
    const lastCommitDate = new Date(repo.repo_updated_at || new Date());
    const daysSinceLastCommit = (new Date().getTime() - lastCommitDate.getTime()) / (1000 * 60 * 60 * 24);
    let healthStatus = 'active';
    if (daysSinceLastCommit > 90) {
      healthStatus = 'abandoned';
    } else if (daysSinceLastCommit > 30) {
      healthStatus = 'neglected';
    }
    return { repoName: repo.name, healthStatus };
  });
  res.json(repoHealth);
});

metricsRouter.get('/repos/languages', async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const repos = await getReposByUser(userId);
  const languageArrays = await Promise.all(repos.map(repo => getLanguagesByRepo(repo.id)));
  const languageTotals: { [lang: string]: number } = {};
  for (const langArr of languageArrays) {
    for (const langObj of langArr) {
      const lang = langObj.language;
      const bytes = langObj.bytes;
      languageTotals[lang] = (languageTotals[lang] || 0) + bytes;
    }
  }
  const totalBytes = Object.values(languageTotals).reduce((sum, bytes) => sum + bytes, 0);
  const languagePercentages: { [lang: string]: number } = {};
  for (const lang in languageTotals) {
    languagePercentages[lang] = totalBytes > 0 ? Math.round((languageTotals[lang] / totalBytes) * 1000) / 10 : 0;
  }
  res.json({ bytes: languageTotals, percentages: languagePercentages });
});

metricsRouter.get('/repos/stale-branches', async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const repos = await getReposByUser(userId);
  const staleThresholdDays = 90;
  const now = new Date();
  const result: { [repoName: string]: Array<{ branch: string; lastCommitDate: string | null }> } = {};
  for (const repo of repos) {
    const branches = await getBranchesByRepo(repo.id);
    const staleBranches = branches
      .filter((branch: Branch) => {
        if (!branch.last_commit_date) return true;
        const daysAgo = (now.getTime() - branch.last_commit_date.getTime()) / (1000 * 60 * 60 * 24);
        return daysAgo > staleThresholdDays;
      })
      .map((branch: Branch) => ({
        branch: branch.name,
        lastCommitDate: branch.last_commit_date ? branch.last_commit_date.toISOString() : null
      }));
    result[repo.name] = staleBranches;
  }
  res.json(result);
});

export default metricsRouter;