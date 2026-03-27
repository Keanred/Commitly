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
import { useActiveRepos, type ActiveRepoData } from './useRepoMetrics';

export interface DashboardData {
  streak: CommitStreakData | null;
  commitByHour: CommitsByHourData | null;
  commitByDay: CommitsByDayData | null;
  weeklyCommitData: WeeklyCommitData | null;
  weeklyPRData: WeeklyPRData | null;
  weeklyQualityData: WeeklyQualityData | null;
  commitHistory: CommitHistoryData | null;
  activeRepos: ActiveRepoData[] | null;
  isDashboardLoading: boolean;
  dashboardLoadProgress: number;
  dashboardLoadingStep: string;
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
  const activeRepos = useActiveRepos();

  const isDashboardLoading =
    streak.loading ||
    commitByHour.loading ||
    commitByDay.loading ||
    weeklyCommitData.loading ||
    weeklyPRData.loading ||
    weeklyQualityData.loading ||
    commitHistory.loading ||
    activeRepos.loading;

  const loadingStates = [
    streak.loading,
    commitByHour.loading,
    commitByDay.loading,
    weeklyCommitData.loading,
    weeklyPRData.loading,
    weeklyQualityData.loading,
    commitHistory.loading,
    activeRepos.loading,
  ];
  const completedCount = loadingStates.filter((loading) => !loading).length;
  const dashboardLoadProgress = Math.round((completedCount / loadingStates.length) * 100);

  const loadingSteps: Array<{ loading: boolean; label: string }> = [
    { loading: streak.loading, label: 'Calculating commit streaks' },
    { loading: commitHistory.loading, label: 'Building commit history grid' },
    { loading: commitByDay.loading, label: 'Analyzing daily productivity' },
    { loading: commitByHour.loading, label: 'Analyzing hourly patterns' },
    { loading: weeklyCommitData.loading, label: 'Aggregating weekly commits' },
    { loading: weeklyPRData.loading, label: 'Aggregating pull request stats' },
    { loading: weeklyQualityData.loading, label: 'Scoring engineering quality' },
    { loading: activeRepos.loading, label: 'Loading active repositories' },
  ];
  const activeStep = loadingSteps.find((step) => step.loading);
  const dashboardLoadingStep = activeStep?.label ?? 'Finalizing dashboard';

  const error =
    streak.error ||
    commitByHour.error ||
    commitByDay.error ||
    weeklyCommitData.error ||
    weeklyPRData.error ||
    weeklyQualityData.error ||
    commitHistory.error ||
    activeRepos.error;

  return {
    streak: streak.data ?? null,
    commitByHour: commitByHour.data ?? null,
    commitByDay: commitByDay.data ?? null,
    weeklyCommitData: weeklyCommitData.data ?? null,
    weeklyPRData: weeklyPRData.data ?? null,
    weeklyQualityData: weeklyQualityData.data ?? null,
    commitHistory: commitHistory.data ?? null,
    activeRepos: activeRepos.data ?? null,
    isDashboardLoading,
    dashboardLoadProgress,
    dashboardLoadingStep,
    error,
  };
};
