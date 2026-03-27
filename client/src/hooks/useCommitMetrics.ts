import { useState, useEffect } from "react";
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
} from "@commitly/schemas";
import { api } from "../client";

export type CommitStreakData = CommitStreakResponse;

export type CommitsByHourData = CommitsByHourResponse;

export type CommitsByDayData = CommitsByDayResponse;

export type WeeklyCommitData = WeeklyDeltaResponse;
export type CommitHistoryCell = { date: string; count: number; intensity: number }
export type CommitHistoryData = CommitHistoryCell[]

export type WeeklyPRData = WeeklyDeltaResponse;

export type WeeklyQualityData = WeeklyDeltaResponse;

let cachedCommitStreak: CommitStreakData | null = null;
let cachedCommitsByHour: CommitsByHourData | null = null;
let cachedCommitsByDay: CommitsByDayData | null = null;
let cachedCommitHistory: CommitHistoryData | null = null;
let cachedWeeklyCommitData: WeeklyCommitData | null = null;
let cachedWeeklyPRData: WeeklyPRData | null = null;
let cachedWeeklyQualityData: WeeklyQualityData | null = null;

export const useCommitStreak = () => {
    const [data, setData] = useState<CommitStreakData | null>(cachedCommitStreak);
    const [loading, setLoading] = useState(!cachedCommitStreak);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (cachedCommitStreak) return;

        api<CommitStreakResponse>('/api/v1/metrics/commits/streak')
        .then((response) => {
            const parsed = commitStreakResponseSchema.parse(response);
            cachedCommitStreak = parsed;
            setData(parsed);
        })
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}

export const useCommitsByHour = () => {
    const [data, setData] = useState<CommitsByHourData | null>(cachedCommitsByHour);
    const [loading, setLoading] = useState(!cachedCommitsByHour);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (cachedCommitsByHour) return;

        api<CommitsByHourResponse>('/api/v1/metrics/commits/by-hour')
        .then((response) => { 
            const parsedResponse = commitsByHourResponseSchema.parse(response);
            const hourCounts = parsedResponse.commitByHour;

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

            const nextData = { commitByHour: formattedByHourCommits };
            cachedCommitsByHour = nextData;
            setData(nextData);
         })
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}

export const useCommitsByDay = () => {
    const [data, setData] = useState<CommitsByDayData | null>(cachedCommitsByDay);
    const [loading, setLoading] = useState(!cachedCommitsByDay);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (cachedCommitsByDay) return;

        api<CommitsByDayResponse>('/api/v1/metrics/commits/by-day')
        .then((response) => {
            const parsedResponse = commitsByDayResponseSchema.parse(response);
            // normalize each day's count to 0–1 intensity for the radar polygon
            const max = Math.max(...Object.values(parsedResponse.commitByDay), 1);
            const eachDayCommits = Object.fromEntries(Object.entries(parsedResponse.commitByDay).map(([day, count]) => {
                return [day, count / max];
            }));
            const nextData = { commitByDay: eachDayCommits };
            cachedCommitsByDay = nextData;
            setData(nextData);
         },
        )
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}

// Example: transform server data into component-ready shape
// Server returns { commitHistory: { "2026-03-19": 5, ... } }
// ContributionGrid expects a contiguous day-by-day series for the past year.
export const useCommitsHistory = () => {
    const [data, setData] = useState<CommitHistoryData | null>(cachedCommitHistory);
    const [loading, setLoading] = useState(!cachedCommitHistory);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (cachedCommitHistory) return;

        api<CommitHistoryResponse>('/api/v1/metrics/commits/history')
        .then((response) => {
            const parsedResponse = commitHistoryResponseSchema.parse(response);
            const days = 52 * 7;
            const today = new Date();
            const entries: { date: string; count: number }[] = [];

            for (let i = days - 1; i >= 0; i--) {
                const date = new Date(today);
                date.setDate(date.getDate() - i);
                const key = date.toISOString().split('T')[0];
                entries.push({ date: key, count: parsedResponse.commitHistory[key] ?? 0 });
            }

            const max = Math.max(...entries.map(e => e.count), 1);
            const nextData = entries.map((e) => ({ ...e, intensity: e.count / max }));
            cachedCommitHistory = nextData;
            setData(nextData);
        })
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}

export const useWeeklyCommitData = () => {
    const [data, setData] = useState<WeeklyCommitData | null>(cachedWeeklyCommitData);
    const [loading, setLoading] = useState(!cachedWeeklyCommitData);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (cachedWeeklyCommitData) return;

        api<WeeklyDeltaResponse>('/api/v1/metrics/commits/weekly')
        .then((response) => {
            const parsed = weeklyDeltaResponseSchema.parse(response);
            cachedWeeklyCommitData = parsed;
            setData(parsed);
        })
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}

export const useWeeklyPRData = () => {
    const [data, setData] = useState<WeeklyPRData | null>(cachedWeeklyPRData);
    const [loading, setLoading] = useState(!cachedWeeklyPRData);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (cachedWeeklyPRData) return;

        api<WeeklyDeltaResponse>('/api/v1/metrics/prs/weekly')
        .then((response) => {
            const parsed = weeklyDeltaResponseSchema.parse(response);
            cachedWeeklyPRData = parsed;
            setData(parsed);
        })
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}

export const useWeeklyQualityData = () => {
    const [data, setData] = useState<WeeklyQualityData | null>(cachedWeeklyQualityData);
    const [loading, setLoading] = useState(!cachedWeeklyQualityData);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (cachedWeeklyQualityData) return;

        api<WeeklyDeltaResponse>('/api/v1/metrics/quality/weekly')
        .then((response) => {
            const parsed = weeklyDeltaResponseSchema.parse(response);
            cachedWeeklyQualityData = parsed;
            setData(parsed);
        })
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}