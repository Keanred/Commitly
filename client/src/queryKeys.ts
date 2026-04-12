export const queryKeys = {
  auth: { user: ['auth', 'user'] },
  sync: ['sync'],
  metrics: {
    dashboard: ['metrics', 'dashboard'],
    streak: ['metrics', 'commits', 'streak'],
    activeRepos: ['metrics', 'active-repos'],
    globalIntegrity: ['metrics', 'global-integrity'],
    repoLanguages: ['metrics', 'repo-languages'],
    commitsByHour: ['metrics', 'commits', 'by-hour'],
    commitsByDay: ['metrics', 'commits', 'by-day'],
    commitHistory: ['metrics', 'commits', 'history'],
    weeklyCommits: ['metrics', 'commits', 'weekly'],
    weeklyPRs: ['metrics', 'prs', 'weekly'],
    weeklyQuality: ['metrics', 'quality', 'weekly'],
    repos: ['metrics', 'repos'],
    integrity: ['metrics', 'integrity'],
    languages: ['metrics', 'languages'],
    staleBranches: ['metrics', 'stale-branches'],
  },
  summary: {
    weekly: ['summary', 'weekly'],
  },
};
