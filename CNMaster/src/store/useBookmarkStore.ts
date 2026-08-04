import { create } from 'zustand';
import { api } from '../services/api';
import Toast from 'react-native-toast-message';
import { BookmarkedQuestion } from '../types';

interface BookmarkState {
  bookmarks: BookmarkedQuestion[];
  isLoading: boolean;

  fetchBookmarks: () => Promise<void>;
  toggleBookmark: (questionId: string) => Promise<boolean>;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: [],
  isLoading: false,

  fetchBookmarks: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/bookmarks');
      if (res.data?.success) {
        set({ bookmarks: res.data.data });
      }
    } catch (error) {
      console.error("Failed to fetch bookmarks", error);
      Toast.show({ type: 'error', text1: 'Failed to load saved questions' });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleBookmark: async (questionId) => {
    const previousBookmarks = get().bookmarks;
    const isCurrentlyBookmarked = previousBookmarks.some(b => b.questionId === questionId);

    if (isCurrentlyBookmarked) {
      set({ bookmarks: previousBookmarks.filter(b => b.questionId !== questionId) });
    }

    try {
      const res = await api.post(`/bookmarks/${questionId}`);
      if (res.data?.success) {
        if (!isCurrentlyBookmarked) {
          get().fetchBookmarks();
        }
        return res.data.data.bookmarked;
      }
      return false;
    } catch (error) {
      console.error("Failed to toggle bookmark", error);
      set({ bookmarks: previousBookmarks });
      Toast.show({ type: 'error', text1: 'Action failed. Please try again.' });
      return isCurrentlyBookmarked; 
    }
  }
}));