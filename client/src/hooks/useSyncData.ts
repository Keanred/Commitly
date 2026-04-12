import {
  fetchBranchesResponseSchema,
  fetchCommitsResponseSchema,
  fetchLanguagesResponseSchema,
  type FetchBranchesResponse,
  type FetchCommitsResponse,
  type FetchLanguagesResponse,
} from '@commitly/schemas';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../client';
import { queryClient } from '../queryClient';
import { queryKeys } from '../queryKeys';

export type SyncStep = 'repos' | 'commits' | 'languages' | 'branches';

export interface SyncProgress {
  currentStep: SyncStep | null;
  completedSteps: SyncStep[];
  totalCommits: number;
  totalLanguages: number;
  totalBranches: number;
}
export const useSyncData = () => {
  const [progress, setProgress] = useState<SyncProgress>({
    currentStep: null,
    completedSteps: [],
    totalCommits: 0,
    totalLanguages: 0,
    totalBranches: 0,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      setProgress({ currentStep: 'repos', completedSteps: [], totalCommits: 0, totalLanguages: 0, totalBranches: 0 });
      await api('/api/v1/repos/fetch');
      setProgress((p) => ({ ...p, currentStep: 'commits', completedSteps: [...p.completedSteps, 'repos'] }));

      const commits = await api<FetchCommitsResponse>('/api/v1/commits/fetch');
      const parsedCommits = fetchCommitsResponseSchema.parse(commits);
      setProgress((p) => ({
        ...p,
        currentStep: 'languages',
        completedSteps: [...p.completedSteps, 'commits'],
        totalCommits: parsedCommits.totalCommits,
      }));

      const languages = await api<FetchLanguagesResponse>('/api/v1/repos/fetch-languages');
      const parsedLanguages = fetchLanguagesResponseSchema.parse(languages);
      setProgress((p) => ({
        ...p,
        currentStep: 'branches',
        completedSteps: [...p.completedSteps, 'languages'],
        totalLanguages: parsedLanguages.totalLanguages,
      }));

      const branches = await api<FetchBranchesResponse>('/api/v1/repos/fetch-branches');
      const parsedBranches = fetchBranchesResponseSchema.parse(branches);
      setProgress((p) => ({
        ...p,
        currentStep: null,
        completedSteps: [...p.completedSteps, 'branches'],
        totalBranches: parsedBranches.totalBranches,
      }));
    },
    onSuccess: async () => {
      setProgress((p) => ({ ...p, currentStep: null }));
      await queryClient.invalidateQueries({ queryKey: queryKeys.metrics.dashboard });
      await queryClient.invalidateQueries({ queryKey: ['metrics'] });
      await queryClient.invalidateQueries({ queryKey: ['summary'] });
    },
  });

  return { sync: mutation.mutate, syncing: mutation.isPending, progress, error: mutation.error };
};
