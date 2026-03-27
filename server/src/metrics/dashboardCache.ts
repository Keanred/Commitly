import type { DashboardMetricsResponse } from '@commitly/schemas';

const DASHBOARD_CACHE_TTL_MS = 60_000;

type CacheEntry = {
  expiresAt: number;
  data: DashboardMetricsResponse;
};

const dashboardCache = new Map<number, CacheEntry>();

export function getCachedDashboardData(userId: number): DashboardMetricsResponse | null {
  const entry = dashboardCache.get(userId);
  if (!entry) return null;
  if (entry.expiresAt <= Date.now()) {
    dashboardCache.delete(userId);
    return null;
  }
  return entry.data;
}

export function setCachedDashboardData(userId: number, data: DashboardMetricsResponse): void {
  dashboardCache.set(userId, {
    data,
    expiresAt: Date.now() + DASHBOARD_CACHE_TTL_MS,
  });
}

export function invalidateDashboardCacheForUser(userId: number): void {
  dashboardCache.delete(userId);
}
