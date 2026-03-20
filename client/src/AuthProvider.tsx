import React from 'react';
import type { User } from './types/User';
import { fetchUser, logoutUser } from './auth-utils';
import { AuthContext } from './AuthContext';
import { useEffect } from 'react';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await fetchUser();
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const refreshUser = async () => {
    setLoading(true);
    try {
      const userData = await fetchUser();
      setUser(userData);
      return userData;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser: user, isAuthenticated: !!user, authLoading: loading, authError: error, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};