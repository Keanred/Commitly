import {
  dashboardMetricsResponseSchema,
  type ActiveRepo,
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
  transformCommitHistory,
  transformCommitsByDay,
  transformCommitsByHour,
  type CommitHistoryCell,
  type CommitHistoryData,
} from '../utils/transforms';

export type { CommitHistoryCell, CommitHistoryData };

export interface DashboardData {
  streak: CommitStreakResponse | null;
  commitByHour: CommitsByHourResponse | null;
  commitByDay: CommitsByDayResponse | null;
  weeklyCommitData: WeeklyDeltaResponse | null;
  weeklyPRData: WeeklyDeltaResponse | null;
  weeklyQualityData: WeeklyDeltaResponse | null;
  commitHistory: CommitHistoryData | null;
  activeRepos: ActiveRepo[] | null;
  isDashboardLoading: boolean;
  dashboardLoadProgress: number;
  dashboardLoadingStep: string;
  error: Error | null;
}

// eslint-disable-next-line complexity
export const useDashboardData = (): DashboardData => {
  const {
    data: dashboardData,
    isPending,
    isFetching,
    error,
  } = useQuery({
    queryKey: queryKeys.metrics.dashboard,
    queryFn: async () => {
      const response = await api<DashboardMetricsResponse>('/api/v1/metrics/dashboard');
      return dashboardMetricsResponseSchema.parse(response);
    },
    staleTime: 60_000,
    refetchOnWindowFocus: true,
    throwOnError: true,
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

  const isDashboardLoading = !dashboardData && (isPending || isFetching);

  let dashboardLoadProgress = 100;
  let dashboardLoadingStep = 'Finalizing dashboard';

  if (!dashboardData) {
    if (isPending) {
      dashboardLoadProgress = 35;
      dashboardLoadingStep = 'Fetching dashboard snapshot';
    } else if (isFetching) {
      dashboardLoadProgress = 75;
      dashboardLoadingStep = 'Processing dashboard metrics';
    } else {
      dashboardLoadProgress = 0;
      dashboardLoadingStep = 'Preparing dashboard data';
    }
  }

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
