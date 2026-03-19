import { useState, useEffect } from "react";
import { api } from "../client";

export const useCommitStreak = () => {
    const [data, setData] = useState<{ currentStreak: number; longestStreak: number } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        api<{ streak: number }>('/api/metrics/commits/streak')
        .then((response) => setData({ currentStreak: response.streak, longestStreak: response.streak }))
        .catch(setError)
        .finally(() => setLoading(false));
    }, []);

    return { data, loading, error };
}