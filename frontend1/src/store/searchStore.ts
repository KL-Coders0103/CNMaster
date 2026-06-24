import { create } from "zustand";
import { globalSearchApi } from "../services/searchService";

interface SearchResults {
  chapters: any[];
  notes: any[];
  assignments: any[];
}

interface SearchStore {
  results: SearchResults;
  isLoading: boolean;
  searchQuery: string;
  performSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  results: { chapters: [], notes: [], assignments: [] },
  isLoading: false,
  searchQuery: "",

  performSearch: async (query: string) => {
    if (!query.trim()) {
      set({ results: { chapters: [], notes: [], assignments: [] }, searchQuery: query });
      return;
    }

    try {
      set({ isLoading: true, searchQuery: query });
      
      const response = await globalSearchApi(query);
      
      set({
        // CRITICAL FIX: Drill into the Axios data wrapper
        results: response.data.data, 
      });
    } catch (error) {
      console.log("Search failed:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  clearSearch: () => {
    set({ results: { chapters: [], notes: [], assignments: [] }, searchQuery: "" });
  },
}));