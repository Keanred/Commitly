import { useState, useEffect } from 'react';
import {
    activeReposResponseSchema,
    globalIntegrityResponseSchema,
    type ActiveRepo,
    type ActiveRepoStatus,
    type GlobalIntegrityResponse,
} from '@commitly/schemas';
import { api } from '../client';

export type RepoStatus = ActiveRepoStatus;

export type ActiveRepoData = ActiveRepo;

export type RepoLanguagesData = {
    bytes: Record<string, number>;
    percentages: Record<string, number>;
}

export type StaleBranchEntry = {
    branch: string;
    lastCommitDate: string | null;
}

export type StaleBranchesData = Record<string, StaleBranchEntry[]>;

export type GlobalIntegrityData = GlobalIntegrityResponse;

export const useActiveRepos = () => {
    const [data, setData] = useState<ActiveRepoData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        api<ActiveRepoData[]>('/api/v1/metrics/repos')
        .then((response) => setData(activeReposResponseSchema.parse(response)))
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}

export const useGlobalIntegrity = () => {
    const [data, setData] = useState<GlobalIntegrityData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        api<GlobalIntegrityData>('/api/v1/metrics/global-integrity')
        .then((response) => setData(globalIntegrityResponseSchema.parse(response)))
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}
