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

export type CommitHistoryData = {
    commitHistory: Record<string, number>;
}

export type WeeklyCommitData = {
    thisWeek: number;
    lastWeek: number;
    delta: number;
}

export const useCommitStreak = () => {
    const [data, setData] = useState<CommitStreakData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        api<{ streak: number }>('/api/v1/metrics/commits/streak')
        .then((response) => setData({ currentStreak: response.streak, longestStreak: response.streak }))
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
        .then((response) => setData({ commitByHour: response.commitByHour }))
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
        .then((response) => setData({ commitByDay: response.commitByDay }))
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}

export const useCommitsHistory = () => {
    const [data, setData] = useState<CommitHistoryData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        api<CommitHistoryData>('/api/v1/metrics/commits/history')
        .then((response) => setData({ commitHistory: response.commitHistory }))
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