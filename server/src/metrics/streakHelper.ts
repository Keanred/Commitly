import type { Commit } from '../types/models';

export function toIsoDateKey(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function computeStreak(commits: Commit[]): { currentStreak: number; longestStreak: number } {
  const commitDates = Array.from(
    new Set(commits.map((commit) => toIsoDateKey(new Date(commit.committed_at)))),
  ).sort();

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

  return { currentStreak, longestStreak: Math.max(longestStreak, currentStreak) };
}
