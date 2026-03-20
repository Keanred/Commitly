import { useState, useCallback } from 'react';
import { api } from '../client';
import type { FetchCommitsResponse, FetchLanguagesResponse, FetchBranchesResponse } from '../types/Sync';

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
      setProgress(p => ({ ...p, currentStep: 'repos' }));
      await api('/api/v1/repos/fetch');
      setProgress(p => ({ ...p, currentStep: 'commits', completedSteps: [...p.completedSteps, 'repos'] }));

      const commits = await api<FetchCommitsResponse>('/api/v1/commits/fetch');
      setProgress(p => ({ ...p, currentStep: 'languages', completedSteps: [...p.completedSteps, 'commits'], totalCommits: commits.totalCommits }));

      const languages = await api<FetchLanguagesResponse>('/api/v1/repos/fetch-languages');
      setProgress(p => ({ ...p, currentStep: 'branches', completedSteps: [...p.completedSteps, 'languages'], totalLanguages: languages.totalLanguages }));

      const branches = await api<FetchBranchesResponse>('/api/v1/repos/fetch-branches');
      setProgress(p => ({ ...p, currentStep: null, completedSteps: [...p.completedSteps, 'branches'], totalBranches: branches.totalBranches }));
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setSyncing(false);
    }
  }, []);

  return { sync, syncing, progress, error };
};
