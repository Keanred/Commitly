import {
  useCommitsByDay,
  useCommitsByHour,
  useCommitsHistory,
  useCommitStreak,
  useWeeklyCommitData,
  useWeeklyPRData,
  useWeeklyQualityData,
  type CommitHistoryData,
  type CommitsByDayData,
  type CommitsByHourData,
  type CommitStreakData,
  type WeeklyCommitData,
  type WeeklyPRData,
  type WeeklyQualityData,
} from './useCommitMetrics';

export interface DashboardData {
  streak: CommitStreakData | null;
  commitByHour: CommitsByHourData | null;
  commitByDay: CommitsByDayData | null;
  weeklyCommitData: WeeklyCommitData | null;
  weeklyPRData: WeeklyPRData | null;
  weeklyQualityData: WeeklyQualityData | null;
  commitHistory: CommitHistoryData | null;
  isDashboardLoading: boolean;
  error: Error | null;
}

export const useDashboardData = (): DashboardData => {
  const streak = useCommitStreak();
  const commitByHour = useCommitsByHour();
  const commitByDay = useCommitsByDay();
  const weeklyCommitData = useWeeklyCommitData();
  const weeklyPRData = useWeeklyPRData();
  const weeklyQualityData = useWeeklyQualityData();
  const commitHistory = useCommitsHistory();

  return {
    streak: streak.data ?? null,
    commitByHour: commitByHour.data ?? null,
    commitByDay: commitByDay.data ?? null,
    weeklyCommitData: weeklyCommitData.data ?? null,
    weeklyPRData: weeklyPRData.data ?? null,
    weeklyQualityData: weeklyQualityData.data ?? null,
    commitHistory: commitHistory.data ?? null,
    isDashboardLoading: streak.loading,
    error: streak.error,
  };
};
