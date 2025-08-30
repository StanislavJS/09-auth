import { create } from 'zustand';
import { User } from '../../types/user';

type AuthStore = {
  isAuthenticated: boolean;
  user: User | null;
  setUser: (user: User) => void;
  clearIsAuthenticated: () => void;
};

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthenticated: typeof window !== 'undefined' && !!localStorage.getItem('user'),
  user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    set(() => ({ user, isAuthenticated: true }));
  },
  clearIsAuthenticated: () => {
    localStorage.removeItem('user');
    set(() => ({ user: null, isAuthenticated: false }));
  },
}));
