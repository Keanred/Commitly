import type { User } from './types/User';

export const fetchUser = async (): Promise<User | null> => {
  try {
    const response = await fetch('/auth/me');
    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }
    const data = await response.json();
    const user: User = {
      id: data.user.id,
      github_id: data.user.github_id,
      login: data.user.login,
      name: data.user.name,
      avatar_url: data.user.avatar_url,
      created_at: new Date(data.user.created_at).toISOString(),
      updated_at: new Date(data.user.updated_at).toISOString(),
    };
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    const response = await fetch('/auth/logout', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to logout');
    }
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
