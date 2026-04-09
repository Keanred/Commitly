import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { fetchUser, logoutUser } from './auth-utils';
import { AuthContext } from './AuthContext';
import { queryClient } from './queryClient';
import { queryKeys } from './queryKeys';
import type { User } from './types/User';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: fetchUser,
    refetchInterval: Infinity,
  });

  useEffect(() => {
    const loadUser = async () => {
      if (isPending) {
        setLoading(true);
        return;
      }
      if (isError) {
        setError(new Error('Failed to fetch user data'));
        setUser(null);
      } else if (data) {
        setUser(data);
        setError(null);
      }
      setLoading(false);
    };
    loadUser();
  }, [data, isError, isPending]);

  const refreshUser = async () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.user });
    if (isError) {
      setError(new Error('Failed to refresh user data'));
      setUser(null);
      return null;
    }
    if (data) {
      setUser(data);
      setError(null);
      return data;
    }
    return null;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider
      value={{ authUser: user, isAuthenticated: !!user, authLoading: loading, authError: error, refreshUser, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
