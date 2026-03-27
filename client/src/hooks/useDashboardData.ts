import {
  dashboardMetricsResponseSchema,
  type ActiveReposResponse,
  type CommitHistoryResponse,
  type CommitStreakResponse,
  type CommitsByDayResponse,
  type CommitsByHourResponse,
  type DashboardMetricsResponse,
  type WeeklyDeltaResponse,
} from '@commitly/schemas';
import { useEffect, useState } from 'react';
import { api } from '../client';

export type CommitStreakData = CommitStreakResponse;
export type CommitsByHourData = CommitsByHourResponse;
export type CommitsByDayData = CommitsByDayResponse;
export type WeeklyCommitData = WeeklyDeltaResponse;
export type WeeklyPRData = WeeklyDeltaResponse;
export type WeeklyQualityData = WeeklyDeltaResponse;
export type ActiveRepoData = ActiveReposResponse[number];
export type CommitHistoryCell = { date: string; count: number; intensity: number };
export type CommitHistoryData = CommitHistoryCell[];

let cachedDashboardPayload: DashboardMetricsResponse | null = null;
let cachedDashboardUpdatedAt = 0;

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
  isRefreshing: boolean;
  error: Error | null;
}

const DASHBOARD_REFRESH_MS = 60_000;

const buildCommitHistory = (response: CommitHistoryResponse): CommitHistoryData => {
  const days = 52 * 7;
  const today = new Date();
  const entries: { date: string; count: number }[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const key = date.toISOString().split('T')[0];
    entries.push({ date: key, count: response.commitHistory[key] ?? 0 });
  }

  const max = Math.max(...entries.map(e => e.count), 1);
  return entries.map((e) => ({ ...e, intensity: e.count / max }));
};

const normalizeCommitByHour = (response: CommitsByHourResponse): CommitsByHourData => {
  const hourCounts = response.commitByHour;
  const blocks = [
    { label: 'Morning', range: [6, 12] },
    { label: 'Afternoon', range: [12, 17] },
    { label: 'Evening', range: [17, 22] },
    { label: 'Night', range: [22, 6] },
  ];

  const blockCounts: Record<string, number> = {};
  for (const block of blocks) {
    let count = 0;
    if (block.range[0] < block.range[1]) {
      for (let h = block.range[0]; h < block.range[1]; h++) count += hourCounts[h] ?? 0;
    } else {
      for (let h = block.range[0]; h < 24; h++) count += hourCounts[h] ?? 0;
      for (let h = 0; h < block.range[1]; h++) count += hourCounts[h] ?? 0;
    }
    blockCounts[block.label] = count;
  }

  const max = Math.max(...Object.values(blockCounts), 1);
  return {
    commitByHour: Object.fromEntries(
      blocks.map(b => [b.label, Math.round((blockCounts[b.label] / max) * 100)]),
    ),
  };
};

const normalizeCommitByDay = (response: CommitsByDayResponse): CommitsByDayData => {
  const max = Math.max(...Object.values(response.commitByDay), 1);
  return {
    commitByDay: Object.fromEntries(
      Object.entries(response.commitByDay).map(([day, count]) => [day, count / max]),
    ),
  };
};

export const useDashboardData = (): DashboardData => {
  const [payload, setPayload] = useState<DashboardMetricsResponse | null>(cachedDashboardPayload);
  const [loading, setLoading] = useState(!cachedDashboardPayload);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const shouldRefresh = Date.now() - cachedDashboardUpdatedAt > DASHBOARD_REFRESH_MS;
    if (!shouldRefresh && cachedDashboardPayload) {
      return;
    }

    if (cachedDashboardPayload) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }

    api<DashboardMetricsResponse>('/api/v1/metrics/dashboard')
      .then((response) => {
        const parsed = dashboardMetricsResponseSchema.parse(response);
        cachedDashboardPayload = parsed;
        cachedDashboardUpdatedAt = Date.now();
        setPayload(parsed);
      })
      .catch(setError)
      .finally(() => {
        setLoading(false);
        setIsRefreshing(false);
      });
  }, []);

  const streak = payload?.streak ?? null;
  const commitByHour = payload ? normalizeCommitByHour(payload.commitByHour) : null;
  const commitByDay = payload ? normalizeCommitByDay(payload.commitByDay) : null;
  const weeklyCommitData = payload?.weeklyCommitData ?? null;
  const weeklyPRData = payload?.weeklyPRData ?? null;
  const weeklyQualityData = payload?.weeklyQualityData ?? null;
  const commitHistory = payload ? buildCommitHistory(payload.commitHistory) : null;
  const activeRepos = payload?.activeRepos ?? null;

  const isDashboardLoading = loading && !payload;
  const dashboardLoadProgress = payload ? 100 : (loading ? 65 : 100);
  const dashboardLoadingStep = payload ? 'Finalizing dashboard' : 'Loading dashboard snapshot';

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
    isRefreshing,
    error,
  };
};
