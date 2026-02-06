import { create } from 'zustand';
import type { LeakAlert } from '@/types';

interface AlertState {
  alerts: LeakAlert[];
  unreadCount: number;
  addAlert: (alert: LeakAlert) => void;
  removeAlert: (alertId: string) => void;
  markAsRead: (alertId: string) => void;
  clearAll: () => void;
}

export const useAlertStore = create<AlertState>((set) => ({
  alerts: [],
  unreadCount: 0,

  addAlert: (alert) => {
    set((state) => ({
      alerts: [alert, ...state.alerts],
      unreadCount: state.unreadCount + 1,
    }));
  },

  removeAlert: (alertId) => {
    set((state) => ({
      alerts: state.alerts.filter((a) => a.id !== alertId),
    }));
  },

  markAsRead: (alertId) => {
    set((state) => {
      const alert = state.alerts.find((a) => a.id === alertId);
      if (alert && alert.status === 'new') {
        return {
          unreadCount: Math.max(0, state.unreadCount - 1),
        };
      }
      return state;
    });
  },

  clearAll: () => {
    set({ alerts: [], unreadCount: 0 });
  },
}));
