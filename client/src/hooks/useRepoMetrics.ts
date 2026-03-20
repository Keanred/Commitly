export type HealthStatus = 'active' | 'neglected' | 'abandoned';

export type RepoHealthData = {
    repoName: string;
    healthStatus: HealthStatus;
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
