export const api = async <T>(path: string): Promise<T> => {
    const res = await fetch(path, { credentials: 'include' });
    if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
    return res.json();
};