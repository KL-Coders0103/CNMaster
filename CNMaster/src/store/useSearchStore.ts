import { create } from 'zustand';
import { api } from '../services/api';
import { SearchResults } from '../types';

interface SearchState {
  query: string;
  results: SearchResults;
  isLoading: boolean;
  
  setQuery: (query: string) => void;
  performSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
}

const initialResults: SearchResults = {
  chapters: [],
  notes: [],
  assignments: []
};

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  results: initialResults,
  isLoading: false,

  setQuery: (query) => set({ query }),

  performSearch: async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      set({ results: initialResults, isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const res = await api.get(`/search?q=${encodeURIComponent(searchQuery)}`);
      if (res.data?.success) {
        set({ results: res.data.data });
      }
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      set({ isLoading: false });
    }
  },

  clearSearch: () => set({ query: '', results: initialResults, isLoading: false })
}));