export const api = async <T>(path: string): Promise<T> => {
  const res = await fetch(path, { credentials: 'include' });
  if (res.status === 401) {
    window.location.href = '/';
    throw new Error('Unauthorized');
  }
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
};
