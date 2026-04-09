import {
  fetchBranchesResponseSchema,
  fetchCommitsResponseSchema,
  fetchLanguagesResponseSchema,
  type FetchBranchesResponse,
  type FetchCommitsResponse,
  type FetchLanguagesResponse,
} from '@commitly/schemas';
import { useCallback, useState } from 'react';
import { api } from '../client';

export type SyncStep = 'repos' | 'commits' | 'languages' | 'branches';

export interface SyncProgress {
  currentStep: SyncStep | null;
  completedSteps: SyncStep[];
  totalCommits: number;
  totalLanguages: number;
  totalBranches: number;
}

export const useSyncData = () => {
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState<SyncProgress>({
    currentStep: null,
    completedSteps: [],
    totalCommits: 0,
    totalLanguages: 0,
    totalBranches: 0,
  });
  const [error, setError] = useState<Error | null>(null);

  const sync = useCallback(async () => {
    setSyncing(true);
    setError(null);
    setProgress({ currentStep: null, completedSteps: [], totalCommits: 0, totalLanguages: 0, totalBranches: 0 });

    try {
      setProgress((p) => ({ ...p, currentStep: 'repos' }));
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
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setSyncing(false);
    }
  }, []);

  return { sync, syncing, progress, error };
};
