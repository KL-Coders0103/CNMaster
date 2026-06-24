import { create } from "zustand";
import { fetchNotificationsApi, markAllAsReadApi, markAsReadApi } from "../services/notificationService";


interface Notification {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationStore {
  notifications: Notification[];
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  isLoading: false,

  fetchNotifications: async () => {
    try {
      set({ isLoading: true });
      
      const response = await fetchNotificationsApi();
      
      set({ 
        notifications: response.data.data || [] 
      });
    } catch (error) {
      console.log("Failed to fetch notifications:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
      }));

      await markAsReadApi(id);
    } catch (error) {
      console.log("Failed to mark notification as read:", error);
      get().fetchNotifications(); 
    }
  },

  markAllAsRead: async () => {
    try {
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      }));

      await markAllAsReadApi();
    } catch (error) {
      console.log("Failed to mark all as read:", error);
      get().fetchNotifications();
    }
  },
}));