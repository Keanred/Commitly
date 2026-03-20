import { useCommitsByDay, useCommitsByHour, useCommitStreak, useWeeklyCommitData, type CommitsByDayData, type CommitsByHourData, type CommitStreakData, type WeeklyCommitData } from './useCommitMetrics';

export interface DashboardData {
  streak: CommitStreakData | null;
  commitByHour: CommitsByHourData | null;
  commitByDay: CommitsByDayData | null;
  weeklyCommitData: WeeklyCommitData | null;
  isDashboardLoading: boolean;
  error: Error | null;
}

export const useDashboardData = (): DashboardData => {
  const streak = useCommitStreak();
  const commitByHour = useCommitsByHour();
  const commitByDay = useCommitsByDay();
  const weeklyCommitData = useWeeklyCommitData();

  return {
    streak: streak.data ?? null,
    commitByHour: commitByHour.data ?? null,
    commitByDay: commitByDay.data ?? null,
    weeklyCommitData: weeklyCommitData.data ?? null,
    isDashboardLoading: streak.loading,
    error: streak.error,
  };
};
