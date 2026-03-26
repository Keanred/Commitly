import { useState, useEffect } from 'react';
import { api } from '../client';

export type RepoStatus = 'healthy' | 'maintenance' | 'failing';

export type ActiveRepoData = {
    name: string;
    description: string;
    language: string | null;
    branch: string;
    status: RepoStatus;
    lastActivity: string;
}

export type RepoLanguagesData = {
    bytes: Record<string, number>;
    percentages: Record<string, number>;
}

export type StaleBranchEntry = {
    branch: string;
    lastCommitDate: string | null;
}

export type StaleBranchesData = Record<string, StaleBranchEntry[]>;

export type GlobalIntegrityData = {
    score: number;
    breakdown: {
        activity: number;
        branchHygiene: number;
        quality: number;
        hygiene: number;
    };
    counts: {
        totalRepos: number;
        healthyRepos: number;
        maintenanceRepos: number;
        failingRepos: number;
        staleBranches: number;
        reposMissingReadme: number;
    };
    summary: string;
}

export const useActiveRepos = () => {
    const [data, setData] = useState<ActiveRepoData[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        api<ActiveRepoData[]>('/api/v1/metrics/repos')
        .then(setData)
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
        .then(setData)
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}
