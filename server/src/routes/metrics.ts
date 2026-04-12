import {
  activeReposResponseSchema,
  commitHistoryResponseSchema,
  commitStreakResponseSchema,
  commitsByDayResponseSchema,
  commitsByHourResponseSchema,
  dashboardMetricsResponseSchema,
  globalIntegrityResponseSchema,
  weeklyDeltaResponseSchema,
} from '@commitly/schemas';
import { Request, Response, Router } from 'express';
import {
  getBranchesByRepo,
  getCommitsByUser,
  getLanguagesByRepo,
  getPullRequestsByUser,
  getReposByUser,
  getUserById,
} from '../db/queries';
import { getCachedDashboardData, setCachedDashboardData } from '../metrics/dashboardCache';
import { computeStreak, toIsoDateKey } from '../metrics/streakHelper';
import type { Branch } from '../types/models';

const metricsRouter = Router();

function clampScore(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function computeCommitsByHour(allCommits: Awaited<ReturnType<typeof getCommitsByUser>>) {
  const hourCounts: { [hour: number]: number } = {};
  for (let i = 0; i < 24; i++) hourCounts[i] = 0;
  for (const commit of allCommits) {
    const hour = new Date(commit.committed_at).getHours();
    hourCounts[hour]++;
  }
  return commitsByHourResponseSchema.parse({ commitByHour: hourCounts });
}

function computeCommitsByDay(allCommits: Awaited<ReturnType<typeof getCommitsByUser>>) {
  const dayCounts: { [day: number]: number } = {};
  for (let i = 0; i < 7; i++) dayCounts[i] = 0;
  for (const commit of allCommits) {
    const day = new Date(commit.committed_at).getDay();
    dayCounts[day]++;
  }
  return commitsByDayResponseSchema.parse({ commitByDay: dayCounts });
}

function computeCommitHistory(allCommits: Awaited<ReturnType<typeof getCommitsByUser>>) {
  const today = new Date();
  const pastDate = new Date(today.getTime() - 52 * 7 * 24 * 60 * 60 * 1000);
  const dateCounts: { [date: string]: number } = {};
  for (const commit of allCommits) {
    const commitDate = new Date(commit.committed_at);
    if (commitDate >= pastDate) {
      const dateKey = toIsoDateKey(commitDate);
      dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
    }
  }
  return commitHistoryResponseSchema.parse({ commitHistory: dateCounts });
}

function computeWeeklyCommitData(allCommits: Awaited<ReturnType<typeof getCommitsByUser>>) {
  const today = new Date();
  const startOfWeek = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
  const startOfLastWeek = new Date(startOfWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
  let thisWeekCount = 0;
  let lastWeekCount = 0;
  for (const commit of allCommits) {
    const commitDate = new Date(commit.committed_at);
    if (commitDate >= startOfWeek) thisWeekCount++;
    else if (commitDate >= startOfLastWeek && commitDate < startOfWeek) lastWeekCount++;
  }
  return weeklyDeltaResponseSchema.parse({
    thisWeek: thisWeekCount,
    lastWeek: lastWeekCount,
    delta: thisWeekCount - lastWeekCount,
  });
}

function computeWeeklyQualityData(allCommits: Awaited<ReturnType<typeof getCommitsByUser>>) {
  const today = new Date();
  const startOfWeek = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
  const startOfLastWeek = new Date(startOfWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekCommits = allCommits.filter((c) => new Date(c.committed_at) >= startOfWeek);
  const lastWeekCommits = allCommits.filter((c) => {
    const d = new Date(c.committed_at);
    return d >= startOfLastWeek && d < startOfWeek;
  });

  function calcQuality(commits: typeof allCommits): number {
    if (commits.length === 0) return 0;
    const avgChanges = commits.reduce((sum, c) => sum + c.additions + c.deletions, 0) / commits.length;
    const sizeScore = Math.max(0, Math.min(50, 50 - ((avgChanges - 50) / 450) * 50));
    const uniqueDays = new Set(commits.map((c) => toIsoDateKey(new Date(c.committed_at)))).size;
    const consistencyScore = Math.min(50, (uniqueDays / 7) * 50);
    return Math.round(sizeScore + consistencyScore);
  }

  const thisWeekQuality = calcQuality(thisWeekCommits);
  const lastWeekQuality = calcQuality(lastWeekCommits);
  return weeklyDeltaResponseSchema.parse({
    thisWeek: thisWeekQuality,
    lastWeek: lastWeekQuality,
    delta: thisWeekQuality - lastWeekQuality,
  });
}

function computeWeeklyPRData(allPRs: Awaited<ReturnType<typeof getPullRequestsByUser>>) {
  const today = new Date();
  const startOfWeek = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
  const startOfLastWeek = new Date(startOfWeek.getTime() - 7 * 24 * 60 * 60 * 1000);
  let thisWeekMerged = 0;
  let lastWeekMerged = 0;
  for (const pr of allPRs) {
    if (!pr.merged || !pr.merged_at) continue;
    const mergedDate = new Date(pr.merged_at);
    if (mergedDate >= startOfWeek) thisWeekMerged++;
    else if (mergedDate >= startOfLastWeek && mergedDate < startOfWeek) lastWeekMerged++;
  }
  return weeklyDeltaResponseSchema.parse({
    thisWeek: thisWeekMerged,
    lastWeek: lastWeekMerged,
    delta: thisWeekMerged - lastWeekMerged,
  });
}

function computeActiveRepos(repos: Awaited<ReturnType<typeof getReposByUser>>) {
  const sorted = [...repos].sort((a, b) => {
    const aTime = a.pushed_at ? new Date(a.pushed_at).getTime() : 0;
    const bTime = b.pushed_at ? new Date(b.pushed_at).getTime() : 0;
    return bTime - aTime;
  });

  const now = new Date();
  // eslint-disable-next-line complexity
  const repoData = sorted.map((repo) => {
    const lastPush = repo.pushed_at ? new Date(repo.pushed_at) : null;
    const daysSinceActivity = lastPush ? (now.getTime() - lastPush.getTime()) / (1000 * 60 * 60 * 24) : Infinity;

    let status: 'healthy' | 'maintenance' | 'failing' = 'healthy';
    if (daysSinceActivity > 90) status = 'failing';
    else if (daysSinceActivity > 30) status = 'maintenance';

    let lastActivity = 'N/A';
    if (lastPush) {
      const diffMs = now.getTime() - lastPush.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      if (diffMins < 60) lastActivity = `${diffMins}m ago`;
      else if (diffHours < 24) lastActivity = `${diffHours}h ago`;
      else lastActivity = `${diffDays}d ago`;
    }

    return {
      name: repo.name,
      description: repo.description || repo.language || 'No description',
      language: repo.language,
      branch: repo.default_branch || 'main',
      status,
      lastActivity,
    };
  });

  return activeReposResponseSchema.parse(repoData);
}

metricsRouter.get('/dashboard', async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const cached = getCachedDashboardData(userId);

  if (cached) {
    return res.json(cached);
  }

  const since = new Date();
  since.setMonth(since.getMonth() - 13);

  const [allCommits, allPRs, repos, user] = await Promise.all([
    getCommitsByUser(userId, since),
    getPullRequestsByUser(userId, since),
    getReposByUser(userId),
    getUserById(userId),
  ]);

  const { currentStreak, longestStreak } = computeStreak(allCommits);

  const data = dashboardMetricsResponseSchema.parse({
    streak: commitStreakResponseSchema.parse({
      currentStreak,
      longestStreak: Math.max(longestStreak, user?.longest_streak ?? 0),
    }),
    commitByHour: computeCommitsByHour(allCommits),
    commitByDay: computeCommitsByDay(allCommits),
    weeklyCommitData: computeWeeklyCommitData(allCommits),
    weeklyPRData: computeWeeklyPRData(allPRs),
    weeklyQualityData: computeWeeklyQualityData(allCommits),
    commitHistory: computeCommitHistory(allCommits),
    activeRepos: computeActiveRepos(repos),
  });

  setCachedDashboardData(userId, data);
  res.json(data);
});

metricsRouter.get('/commits/streak', async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const since = new Date();
  since.setMonth(since.getMonth() - 13);
  const [allCommits, user] = await Promise.all([getCommitsByUser(userId, since), getUserById(userId)]);
  const { currentStreak, longestStreak } = computeStreak(allCommits);
  const response = commitStreakResponseSchema.parse({
    currentStreak,
    longestStreak: Math.max(longestStreak, user?.longest_streak ?? 0),
  });
  res.json(response);
});

metricsRouter.get('/commits/by-hour', async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const since = new Date();
  since.setMonth(since.getMonth() - 13);
  const allCommits = await getCommitsByUser(userId, since);
  const hourCounts: { [hour: number]: number } = {};
  for (let i = 0; i < 24; i++) {
    hourCounts[i] = 0;
  }
  for (const commit of allCommits) {
    const hour = new Date(commit.committed_at).getHours();
    hourCounts[hour]++;
  }

  const response = commitsByHourResponseSchema.parse({ commitByHour: hourCounts });
  res.json(response);
});

metricsRouter.get('/commits/by-day', async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const since = new Date();
  since.setMonth(since.getMonth() - 13);
  const allCommits = await getCommitsByUser(userId, since);
  const dayCounts: { [day: number]: number } = {};
  for (let i = 0; i < 7; i++) {
    dayCounts[i] = 0;
  }
  for (const commit of allCommits) {
    const day = new Date(commit.committed_at).getDay();
    dayCounts[day]++;
  }
  const response = commitsByDayResponseSchema.parse({ commitByDay: dayCounts });
  res.json(response);
});

metricsRouter.get('/commits/history', async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const since = new Date();
  since.setMonth(since.getMonth() - 13);
  const allCommits = await getCommitsByUser(userId, since);
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

  const response = commitHistoryResponseSchema.parse({ commitHistory: dateCounts });
  res.json(response);
});

metricsRouter.get('/commits/weekly', async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const since = new Date();
  since.setMonth(since.getMonth() - 13);
  const allCommits = await getCommitsByUser(userId, since);
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
  const response = weeklyDeltaResponseSchema.parse({ thisWeek: thisWeekCount, lastWeek: lastWeekCount, delta });
  res.json(response);
});

metricsRouter.get('/prs/weekly', async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const since = new Date();
  since.setMonth(since.getMonth() - 13);
  const allPRs = await getPullRequestsByUser(userId, since);
  const today = new Date();
  const startOfWeek = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
  const startOfLastWeek = new Date(startOfWeek.getTime() - 7 * 24 * 60 * 60 * 1000);

  let thisWeekMerged = 0;
  let lastWeekMerged = 0;

  for (const pr of allPRs) {
    if (!pr.merged || !pr.merged_at) continue;
    const mergedDate = new Date(pr.merged_at);
    if (mergedDate >= startOfWeek) {
      thisWeekMerged++;
    } else if (mergedDate >= startOfLastWeek && mergedDate < startOfWeek) {
      lastWeekMerged++;
    }
  }

  const delta = thisWeekMerged - lastWeekMerged;
  const response = weeklyDeltaResponseSchema.parse({ thisWeek: thisWeekMerged, lastWeek: lastWeekMerged, delta });
  res.json(response);
});

metricsRouter.get('/quality/weekly', async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const since = new Date();
  since.setMonth(since.getMonth() - 13);
  const allCommits = await getCommitsByUser(userId, since);
  const today = new Date();
  const startOfWeek = new Date(today.getTime() - today.getDay() * 24 * 60 * 60 * 1000);
  const startOfLastWeek = new Date(startOfWeek.getTime() - 7 * 24 * 60 * 60 * 1000);

  const thisWeekCommits = allCommits.filter((c) => new Date(c.committed_at) >= startOfWeek);
  const lastWeekCommits = allCommits.filter((c) => {
    const d = new Date(c.committed_at);
    return d >= startOfLastWeek && d < startOfWeek;
  });

  function calcQuality(commits: typeof allCommits): number {
    if (commits.length === 0) return 0;

    // 1. Commit size score (0-50): smaller avg changes = better discipline
    const avgChanges = commits.reduce((sum, c) => sum + c.additions + c.deletions, 0) / commits.length;
    // Under 50 lines avg = perfect 50, scales down to 0 at 500+ lines
    const sizeScore = Math.max(0, Math.min(50, 50 - ((avgChanges - 50) / 450) * 50));

    // 2. Consistency score (0-50): how many unique days had commits out of 7
    const uniqueDays = new Set(commits.map((c) => new Date(c.committed_at).toISOString().split('T')[0])).size;
    const consistencyScore = Math.min(50, (uniqueDays / 7) * 50);

    return Math.round(sizeScore + consistencyScore);
  }

  const thisWeekQuality = calcQuality(thisWeekCommits);
  const lastWeekQuality = calcQuality(lastWeekCommits);
  const delta = thisWeekQuality - lastWeekQuality;

  const response = weeklyDeltaResponseSchema.parse({ thisWeek: thisWeekQuality, lastWeek: lastWeekQuality, delta });
  res.json(response);
});

metricsRouter.get('/repos', async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const repos = await getReposByUser(userId);
  repos.sort((a, b) => {
    const aTime = a.pushed_at ? new Date(a.pushed_at).getTime() : 0;
    const bTime = b.pushed_at ? new Date(b.pushed_at).getTime() : 0;
    return bTime - aTime;
  });
  const now = new Date();

  // eslint-disable-next-line complexity
  const repoData = repos.map((repo) => {
    const lastPush = repo.pushed_at ? new Date(repo.pushed_at) : null;
    const daysSinceActivity = lastPush ? (now.getTime() - lastPush.getTime()) / (1000 * 60 * 60 * 24) : Infinity;

    let status: string = 'healthy';
    if (daysSinceActivity > 90) {
      status = 'failing';
    } else if (daysSinceActivity > 30) {
      status = 'maintenance';
    }

    let lastActivity = 'N/A';
    if (lastPush) {
      const diffMs = now.getTime() - lastPush.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      if (diffMins < 60) lastActivity = `${diffMins}m ago`;
      else if (diffHours < 24) lastActivity = `${diffHours}h ago`;
      else lastActivity = `${diffDays}d ago`;
    }

    return {
      name: repo.name,
      description: repo.description || repo.language || 'No description',
      language: repo.language,
      branch: repo.default_branch || 'main',
      status,
      lastActivity,
    };
  });

  const response = activeReposResponseSchema.parse(repoData);
  res.json(response);
});

metricsRouter.get('/repos/languages', async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const repos = await getReposByUser(userId);
  const languageArrays = await Promise.all(repos.map((repo) => getLanguagesByRepo(repo.id)));
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
        lastCommitDate: branch.last_commit_date ? branch.last_commit_date.toISOString() : null,
      }));
    result[repo.name] = staleBranches;
  }
  res.json(result);
});

// eslint-disable-next-line complexity
metricsRouter.get('/global-integrity', async (req: Request, res: Response) => {
  const userId = req.session.userId as number;
  const repos = await getReposByUser(userId);
  const now = new Date();

  if (repos.length === 0) {
    const response = globalIntegrityResponseSchema.parse({
      score: 0,
      breakdown: {
        activity: 0,
        branchHygiene: 0,
        quality: 0,
        hygiene: 0,
      },
      counts: {
        totalRepos: 0,
        healthyRepos: 0,
        maintenanceRepos: 0,
        failingRepos: 0,
        staleBranches: 0,
        reposMissingReadme: 0,
      },
      summary: 'Sync repositories to compute global integrity.',
    });
    return res.json(response);
  }

  let healthyRepos = 0;
  let maintenanceRepos = 0;
  let failingRepos = 0;
  let totalActivityScore = 0;

  for (const repo of repos) {
    const lastPush = repo.pushed_at ? new Date(repo.pushed_at) : null;
    const daysSinceActivity = lastPush ? (now.getTime() - lastPush.getTime()) / (1000 * 60 * 60 * 24) : Infinity;

    if (daysSinceActivity > 90) {
      failingRepos++;
      totalActivityScore += 20;
    } else if (daysSinceActivity > 30) {
      maintenanceRepos++;
      totalActivityScore += 60;
    } else {
      healthyRepos++;
      totalActivityScore += 100;
    }
  }

  const activityScore = clampScore(totalActivityScore / repos.length);

  let staleBranches = 0;
  const staleThresholdDays = 90;
  for (const repo of repos) {
    const branches = await getBranchesByRepo(repo.id);
    staleBranches += branches.filter((branch: Branch) => {
      if (!branch.last_commit_date) return true;
      const daysAgo = (now.getTime() - branch.last_commit_date.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo > staleThresholdDays;
    }).length;
  }

  const stalePenalty = Math.min(60, (8 * staleBranches) / Math.max(1, repos.length));
  const branchHygieneScore = clampScore(100 - stalePenalty);

  const since = new Date();
  since.setMonth(since.getMonth() - 13);
  const allCommits = await getCommitsByUser(userId, since);
  const startOfWeek = new Date(now.getTime() - now.getDay() * 24 * 60 * 60 * 1000);
  const thisWeekCommits = allCommits.filter((commit) => new Date(commit.committed_at) >= startOfWeek);
  let qualityScore = 0;
  if (thisWeekCommits.length > 0) {
    const avgChanges =
      thisWeekCommits.reduce((sum, commit) => sum + commit.additions + commit.deletions, 0) / thisWeekCommits.length;
    const sizeScore = Math.max(0, Math.min(50, 50 - ((avgChanges - 50) / 450) * 50));
    const uniqueDays = new Set(
      thisWeekCommits.map((commit) => new Date(commit.committed_at).toISOString().split('T')[0]),
    ).size;
    const consistencyScore = Math.min(50, (uniqueDays / 7) * 50);
    qualityScore = clampScore(sizeScore + consistencyScore);
  }

  const reposMissingReadme = repos.filter((repo) => !repo.has_readme).length;
  const readmeCoverage = ((repos.length - reposMissingReadme) / repos.length) * 100;
  const avgOpenIssues = repos.reduce((sum, repo) => sum + repo.open_issues, 0) / repos.length;
  const issueScore = Math.max(0, 100 - Math.min(100, avgOpenIssues * 5));
  const hygieneScore = clampScore(readmeCoverage * 0.6 + issueScore * 0.4);

  const score = clampScore(activityScore * 0.45 + branchHygieneScore * 0.3 + qualityScore * 0.15 + hygieneScore * 0.1);

  let summary = 'Your repositories are in excellent health overall.';
  if (failingRepos > 0) {
    summary = `${failingRepos} repos are stale and need attention.`;
  } else if (maintenanceRepos > 0) {
    summary = `${maintenanceRepos} repos are entering maintenance territory.`;
  } else if (reposMissingReadme > 0) {
    summary = `${reposMissingReadme} repos are missing a README.`;
  }

  const response = globalIntegrityResponseSchema.parse({
    score,
    breakdown: {
      activity: activityScore,
      branchHygiene: branchHygieneScore,
      quality: qualityScore,
      hygiene: hygieneScore,
    },
    counts: {
      totalRepos: repos.length,
      healthyRepos,
      maintenanceRepos,
      failingRepos,
      staleBranches,
      reposMissingReadme,
    },
    summary,
  });
  res.json(response);
});

export default metricsRouter;
