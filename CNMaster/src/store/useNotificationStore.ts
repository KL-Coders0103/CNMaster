import { create } from 'zustand';
import { api } from '../services/api';
import { AppNotification } from '../types';

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;

  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/notifications');
      if (res.data?.success) {
        const notifications: AppNotification[] = res.data.data;
        const unreadCount = notifications.filter(n => !n.isRead).length;
        set({ notifications, unreadCount });
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    const { notifications } = get();
    const target = notifications.find(n => n.id === id);
    if (!target || target.isRead) return;

    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    );
    const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
    set({ notifications: updatedNotifications, unreadCount });

    try {
      await api.patch(`/notifications/${id}/read`);
    } catch (error) {
      console.error("Failed to mark notification as read", error);
      set({ notifications, unreadCount: get().unreadCount });
    }
  },

  markAllAsRead: async () => {
    const { notifications } = get();
    const hasUnread = notifications.some(n => !n.isRead);
    if (!hasUnread) return;

    const updatedNotifications = notifications.map(n => ({ ...n, isRead: true }));
    set({ notifications: updatedNotifications, unreadCount: 0 });

    try {
      await api.patch('/notifications/read-all');
    } catch (error) {
      console.error("Failed to mark all as read", error);
      set({ notifications, unreadCount: get().unreadCount });
    }
  }
}));