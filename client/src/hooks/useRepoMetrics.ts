import { useState, useEffect } from 'react';
import {
    activeReposResponseSchema,
    globalIntegrityResponseSchema,
    repoLanguagesResponseSchema,
    staleBranchesResponseSchema,
    type ActiveRepo,
    type ActiveRepoStatus,
    type GlobalIntegrityResponse,
    type RepoLanguagesResponse,
    type StaleBranchEntry,
} from '@commitly/schemas';
import { api } from '../client';

export type RepoStatus = ActiveRepoStatus;

export type ActiveRepoData = ActiveRepo;

export type RepoLanguagesData = RepoLanguagesResponse;

export type StaleBranchesData = Record<string, StaleBranchEntry[]>;

export type GlobalIntegrityData = GlobalIntegrityResponse;

let cachedActiveRepos: ActiveRepoData[] | null = null;
let cachedGlobalIntegrity: GlobalIntegrityData | null = null;
let cachedRepoLanguages: RepoLanguagesData | null = null;
let cachedStaleBranches: StaleBranchesData | null = null;

export const useActiveRepos = () => {
    const [data, setData] = useState<ActiveRepoData[] | null>(cachedActiveRepos);
    const [loading, setLoading] = useState(!cachedActiveRepos);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (cachedActiveRepos) return;

        api<ActiveRepoData[]>('/api/v1/metrics/repos')
        .then((response) => {
            const parsed = activeReposResponseSchema.parse(response);
            cachedActiveRepos = parsed;
            setData(parsed);
        })
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}

export const useGlobalIntegrity = () => {
    const [data, setData] = useState<GlobalIntegrityData | null>(cachedGlobalIntegrity);
    const [loading, setLoading] = useState(!cachedGlobalIntegrity);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (cachedGlobalIntegrity) return;

        api<GlobalIntegrityData>('/api/v1/metrics/global-integrity')
        .then((response) => {
            const parsed = globalIntegrityResponseSchema.parse(response);
            cachedGlobalIntegrity = parsed;
            setData(parsed);
        })
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}

export const useRepoLanguages = () => {
    const [data, setData] = useState<RepoLanguagesData | null>(cachedRepoLanguages);
    const [loading, setLoading] = useState(!cachedRepoLanguages);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (cachedRepoLanguages) return;

        api<RepoLanguagesData>('/api/v1/metrics/repos/languages')
        .then((response) => {
            const parsed = repoLanguagesResponseSchema.parse(response);
            cachedRepoLanguages = parsed;
            setData(parsed);
        })
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}

export const useStaleBranches = () => {
    const [data, setData] = useState<StaleBranchesData | null>(cachedStaleBranches);
    const [loading, setLoading] = useState(!cachedStaleBranches);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (cachedStaleBranches) return;

        api<StaleBranchesData>('/api/v1/metrics/repos/stale-branches')
        .then((response) => {
            const parsed = staleBranchesResponseSchema.parse(response);
            cachedStaleBranches = parsed;
            setData(parsed);
        })
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}
