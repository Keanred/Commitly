import { createContext } from 'react';
import type { User } from './types/User';
import { fetchUser, logoutUser } from './auth-utils';
import { useContext } from 'react';

export interface AuthContextType {
  authUser: User | null;
  isAuthenticated: boolean;
  authLoading: boolean;
  authError: Error | null;
  refreshUser: () => Promise<User | null>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  authUser: null,
  isAuthenticated: false,
  authLoading: true,
  authError: null,
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
