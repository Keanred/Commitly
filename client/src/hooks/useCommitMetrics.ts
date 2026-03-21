import { useState, useEffect } from "react";
import { api } from "../client";

export type CommitStreakData = {
    currentStreak: number;
    longestStreak: number;
}

export type CommitsByHourData = {
    commitByHour: Record<number, number>;
}

export type CommitsByDayData = {
    commitByDay: Record<number, number>;
}

export type WeeklyCommitData = {
    thisWeek: number;
    lastWeek: number;
    delta: number;
}
export type CommitHistoryCell = { date: string; count: number; intensity: number }
export type CommitHistoryData = CommitHistoryCell[]

export type WeeklyPRData = {
    thisWeek: number;
    lastWeek: number;
    delta: number;
}

export type WeeklyQualityData = {
    thisWeek: number;
    lastWeek: number;
    delta: number;
}

export const useCommitStreak = () => {
    const [data, setData] = useState<CommitStreakData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        api<{ currentStreak: number; longestStreak: number }>('/api/v1/metrics/commits/streak')
        .then((response) => setData({ currentStreak: response.currentStreak, longestStreak: response.longestStreak }))
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}

export const useCommitsByHour = () => {
    const [data, setData] = useState<CommitsByHourData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        api<CommitsByHourData>('/api/v1/metrics/commits/by-hour')
        .then((response) => { 
            const hourCounts = response.commitByHour;

            // Group into time blocks
            const blocks = [
                { label: 'Morning', range: [6, 12], icon: 'wb_sunny' },
                { label: 'Afternoon', range: [12, 17], icon: 'wb_twilight' },
                { label: 'Evening', range: [17, 22], icon: 'dark_mode' },
                { label: 'Night', range: [22, 6], icon: 'bedtime' },
            ];

            const blockCounts: Record<string, number> = {};
            for (const block of blocks) {
                let count = 0;
                if (block.range[0] < block.range[1]) {
                    for (let h = block.range[0]; h < block.range[1]; h++) {
                        count += hourCounts[h] ?? 0;
                    }
                } else {
                    // Night wraps: 22-23 + 0-5
                    for (let h = block.range[0]; h < 24; h++) count += hourCounts[h] ?? 0;
                    for (let h = 0; h < block.range[1]; h++) count += hourCounts[h] ?? 0;
                }
                blockCounts[block.label] = count;
            }

            const max = Math.max(...Object.values(blockCounts), 1);
            const formattedByHourCommits = Object.fromEntries(
                blocks.map(b => [b.label, Math.round((blockCounts[b.label] / max) * 100)])
            );
            
            setData({ commitByHour: formattedByHourCommits });
            
            setData({ commitByHour: formattedByHourCommits });
         })
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}

export const useCommitsByDay = () => {
    const [data, setData] = useState<CommitsByDayData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        api<CommitsByDayData>('/api/v1/metrics/commits/by-day')
        .then((response) => {
            // normalize each day's count to 0–1 intensity for the radar polygon
            const max = Math.max(...Object.values(response.commitByDay), 1);
            const eachDayCommits = Object.fromEntries(Object.entries(response.commitByDay).map(([day, count]) => {
                return [day, count / max];
            }));
            setData({ commitByDay: eachDayCommits });
         },
        )
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}

// Example: transform server data into component-ready shape
// Server returns { commitHistory: { "2026-03-19": 5, ... } }
// ContributionGrid expects number[] of 50 intensity values (0–1)
export const useCommitsHistory = () => {
    const [data, setData] = useState<CommitHistoryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        api<{ commitHistory: Record<string, number> }>('/api/v1/metrics/commits/history')
        .then((response) => {
            const days = 50;
            const today = new Date();
            const entries: { date: string; count: number }[] = [];

            for (let i = days - 1; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const key = date.toISOString().split('T')[0];
                entries.push({ date: key, count: response.commitHistory[key] ?? 0 });
            }

            const max = Math.max(...entries.map(e => e.count), 1);
            setData(entries.map((e) => ({ ...e, intensity: e.count / max })));
        })
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}

export const useWeeklyCommitData = () => {
    const [data, setData] = useState<WeeklyCommitData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        api<WeeklyCommitData>('/api/v1/metrics/commits/weekly')
        .then((response) => setData({ thisWeek: response.thisWeek, lastWeek: response.lastWeek, delta: response.delta }))
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}

export const useWeeklyPRData = () => {
    const [data, setData] = useState<WeeklyPRData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        api<WeeklyPRData>('/api/v1/metrics/prs/weekly')
        .then((response) => setData({ thisWeek: response.thisWeek, lastWeek: response.lastWeek, delta: response.delta }))
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}

export const useWeeklyQualityData = () => {
    const [data, setData] = useState<WeeklyQualityData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        api<WeeklyQualityData>('/api/v1/metrics/quality/weekly')
        .then((response) => setData({ thisWeek: response.thisWeek, lastWeek: response.lastWeek, delta: response.delta }))
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}