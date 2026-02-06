import { create } from 'zustand';
import { api } from '../lib/api';

interface AuthState {
  accessToken: string | null;
  user: { email: string; role: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem('accessToken'),
  user: null,
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const token = res.data.data.accessToken;
    localStorage.setItem('accessToken', token);
    set({ accessToken: token, user: res.data.data.user });
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    set({ accessToken: null, user: null });
  },
}));
