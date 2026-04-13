import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import { queryKeys } from '../queryKeys';

export type WeeklyDigestBar = {
  label: string;
  value: number;
};

export type WeeklyDigestTechStackEntry = {
  label: string;
  percentage: number;
};

export type WeeklyDigestContribution = {
  title: string;
  repo: string;
  repoOrg: string;
  impact: number;
};

export type WeeklyDigestData = {
  weekStart: string;
  weekEnd: string;
  consistencyScore: number;
  consistencyBars: WeeklyDigestBar[];
  techStackPulse: WeeklyDigestTechStackEntry[];
  topContributions: WeeklyDigestContribution[];
};

export const useWeeklyDigestData = () => {
  return useQuery({
    queryKey: queryKeys.summary.weekly,
    throwOnError: true,
    queryFn: async () => api<WeeklyDigestData>('/api/v1/summary/weekly'),
  });
};
