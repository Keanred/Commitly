import {
  dashboardMetricsResponseSchema,
  type ActiveReposResponse,
  type CommitStreakResponse,
  type CommitsByDayResponse,
  type CommitsByHourResponse,
  type DashboardMetricsResponse,
  type WeeklyDeltaResponse,
} from '@commitly/schemas';
import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import { queryKeys } from '../queryKeys';
import {
  transformCommitsByHour,
  transformCommitsByDay,
  transformCommitHistory,
  type CommitHistoryCell,
  type CommitHistoryData,
} from '../utils/transforms';

export type CommitStreakData = CommitStreakResponse;
export type CommitsByHourData = CommitsByHourResponse;
export type CommitsByDayData = CommitsByDayResponse;
export type WeeklyCommitData = WeeklyDeltaResponse;
export type WeeklyPRData = WeeklyDeltaResponse;
export type WeeklyQualityData = WeeklyDeltaResponse;
export type ActiveRepoData = ActiveReposResponse[number];
export type { CommitHistoryCell, CommitHistoryData };

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
  const {
    data: dashboardData,
    isLoading,
    isFetching,
    error,
  } = useQuery({
    queryKey: [queryKeys.metrics.dashboard],
    queryFn: async () => {
      const response = await api<DashboardMetricsResponse>('/api/v1/metrics/dashboard');
      return dashboardMetricsResponseSchema.parse(response);
    },
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  const streak = dashboardData?.streak ?? null;
  const commitByHour = dashboardData ? transformCommitsByHour(dashboardData.commitByHour) : null;
  const commitByDay = dashboardData ? transformCommitsByDay(dashboardData.commitByDay) : null;
  const weeklyCommitData = dashboardData?.weeklyCommitData ?? null;
  const weeklyPRData = dashboardData?.weeklyPRData ?? null;
  const weeklyQualityData = dashboardData?.weeklyQualityData ?? null;
  const commitHistory = dashboardData ? transformCommitHistory(dashboardData.commitHistory) : null;
  const activeRepos = dashboardData?.activeRepos ?? null;

  const isDashboardLoading = isFetching && !isLoading;
  const dashboardLoadProgress = dashboardData ? 100 : isLoading ? 65 : 100;
  const dashboardLoadingStep = dashboardData ? 'Finalizing dashboard' : 'Loading dashboard snapshot';

  return {
    streak,
    commitByHour,
    commitByDay,
    weeklyCommitData,
    weeklyPRData,
    weeklyQualityData,
    commitHistory,
    activeRepos,
    isDashboardLoading,
    dashboardLoadProgress,
    dashboardLoadingStep,
    error,
  };
};
