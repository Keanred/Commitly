export const queryKeys = {
  auth: { user: ['auth', 'user'] },
  metrics: {
    dashboard: ['metrics', 'dashboard'],
    streak: ['metrics', 'commits', 'streak'],
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
