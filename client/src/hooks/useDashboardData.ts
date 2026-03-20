import { useCommitStreak, type CommitStreakData } from './useCommitMetrics';

export interface DashboardData {
  streak: CommitStreakData | null;
  isDashboardLoading: boolean;
  error: Error | null;
}

export const useDashboardData = (): DashboardData => {
  const streak = useCommitStreak();

  return {
    streak: streak.data,
    isDashboardLoading: streak.loading,
    error: streak.error,
  };
};
