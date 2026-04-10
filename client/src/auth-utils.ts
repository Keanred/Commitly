import type { User } from './types/User';

export const fetchUser = async (): Promise<User | null> => {
  const response = await fetch('/auth/me', { credentials: 'include' });
  if (response.status === 401) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.status}`);
  }
  const data = await response.json();
  const user: User = {
    id: data.id,
    github_id: data.github_id,
    login: data.login,
    name: data.name,
    avatar_url: data.avatar_url,
    created_at: new Date(data.created_at).toISOString(),
    updated_at: new Date(data.updated_at).toISOString(),
  };
  return user;
};

export const logoutUser = async (): Promise<void> => {
  try {
    const response = await fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('Failed to logout');
    }
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
