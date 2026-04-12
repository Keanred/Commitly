import {
  activeReposResponseSchema,
  globalIntegrityResponseSchema,
  repoLanguagesResponseSchema,
  staleBranchesResponseSchema,
  type ActiveReposResponse,
  type GlobalIntegrityResponse,
  type RepoLanguagesResponse,
  type StaleBranchesResponse,
} from '@commitly/schemas';
import { useQuery } from '@tanstack/react-query';
import { api } from '../client';
import { queryKeys } from '../queryKeys';

export const useActiveRepos = () => {
  return useQuery({
    queryKey: queryKeys.metrics.activeRepos,
    staleTime: 5 * 60_000,
    throwOnError: true,
    queryFn: async () => {
      const response = await api<ActiveReposResponse>('/api/v1/metrics/repos');
      return activeReposResponseSchema.parse(response);
    },
  });
};

export const useGlobalIntegrity = () => {
  return useQuery({
    queryKey: queryKeys.metrics.globalIntegrity,
    throwOnError: true,
    queryFn: async () => {
      const response = await api<GlobalIntegrityResponse>('/api/v1/metrics/global-integrity');
      return globalIntegrityResponseSchema.parse(response);
    },
  });
};

export const useRepoLanguanges = () => {
  return useQuery({
    queryKey: queryKeys.metrics.repoLanguages,
    throwOnError: true,
    queryFn: async () => {
      const response = await api<RepoLanguagesResponse>('/api/v1/metrics/repos/languages');
      return repoLanguagesResponseSchema.parse(response);
    },
  });
};

export const useStaleBranches = () => {
  return useQuery({
    queryKey: queryKeys.metrics.staleBranches,
    staleTime: 5 * 60_000,
    throwOnError: true,
    queryFn: async () => {
      const response = await api<StaleBranchesResponse>('/api/v1/metrics/repos/stale-branches');
      return staleBranchesResponseSchema.parse(response);
    },
  });
};
