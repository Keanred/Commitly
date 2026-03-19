import { createContext } from 'react';
import type { User } from './types/User';
import { fetchUser, logoutUser } from './auth-utils';
import { useContext } from 'react';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: Error | null;
  refreshUser: () => Promise<User | null>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
  refreshUser: fetchUser,
  logout: logoutUser,
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
