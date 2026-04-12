import {
  commitHistoryResponseSchema,
  commitStreakResponseSchema,
  commitsByDayResponseSchema,
  commitsByHourResponseSchema,
  weeklyDeltaResponseSchema,
  type CommitHistoryResponse,
  type CommitStreakResponse,
  type CommitsByDayResponse,
  type CommitsByHourResponse,
  type WeeklyDeltaResponse,
} from '@commitly/schemas';
import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import { queryKeys } from '../queryKeys';
import { transformCommitHistory, transformCommitsByDay, transformCommitsByHour } from '../utils/transforms';

export type { CommitHistoryCell, CommitHistoryData } from '../utils/transforms';

export const useCommitStreak = () => {
  return useQuery({
    queryKey: queryKeys.metrics.streak,
    throwOnError: true,
    queryFn: async () => {
      const response = await api<CommitStreakResponse>('/api/v1/metrics/commits/streak');
      return commitStreakResponseSchema.parse(response);
    },
  });
};

export const useCommitsByHour = () => {
  return useQuery({
    queryKey: queryKeys.metrics.commitsByHour,
    throwOnError: true,
    queryFn: async () => {
      const response = await api<CommitsByHourResponse>('/api/v1/metrics/commits/by-hour');
      return transformCommitsByHour(commitsByHourResponseSchema.parse(response));
    },
  });
};

export const useCommitsByDay = () => {
  return useQuery({
    queryKey: queryKeys.metrics.commitsByDay,
    throwOnError: true,
    queryFn: async () => {
      const response = await api<CommitsByDayResponse>('/api/v1/metrics/commits/by-day');
      return transformCommitsByDay(commitsByDayResponseSchema.parse(response));
    },
  });
};

export const useCommitsHistory = () => {
  return useQuery({
    queryKey: queryKeys.metrics.commitHistory,
    throwOnError: true,
    queryFn: async () => {
      const response = await api<CommitHistoryResponse>('/api/v1/metrics/commits/history');
      return transformCommitHistory(commitHistoryResponseSchema.parse(response));
    },
  });
};

export const useWeeklyCommitData = () => {
  return useQuery({
    queryKey: queryKeys.metrics.weeklyCommits,
    throwOnError: true,
    queryFn: async () => {
      const response = await api<WeeklyDeltaResponse>('/api/v1/metrics/commits/weekly');
      return weeklyDeltaResponseSchema.parse(response);
    },
  });
};

export const useWeeklyPRData = () => {
  return useQuery({
    queryKey: queryKeys.metrics.weeklyPRs,
    throwOnError: true,
    queryFn: async () => {
      const response = await api<WeeklyDeltaResponse>('/api/v1/metrics/prs/weekly');
      return weeklyDeltaResponseSchema.parse(response);
    },
  });
};

export const useWeeklyQualityData = () => {
  return useQuery({
    queryKey: queryKeys.metrics.weeklyQuality,
    throwOnError: true,
    queryFn: async () => {
      const response = await api<WeeklyDeltaResponse>('/api/v1/metrics/quality/weekly');
      return weeklyDeltaResponseSchema.parse(response);
    },
  });
};
