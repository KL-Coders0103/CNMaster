import { create } from "zustand";

import {
  Chapter,
  Note,
  RecentNote,
} from "../types/notes";

import {
  getChapters,
  getNotes,
  bookmarkNote,
  removeBookmark,
  getRecentNotes,
} from "../services/notesService";

type NotesState = {
  chapters: Chapter[];
  notes: Note[];
  recentNotes: RecentNote[];

  selectedChapter: string | null;

  search: string;
  isLoading: boolean;

  fetchRecentNotes: () => Promise<void>;
  fetchChapters: () => Promise<void>;
  fetchNotes: () => Promise<void>;
  setSelectedChapter: (chapterId: string | null) => Promise<void>;
  setSearch: (search: string) => Promise<void>;
  bookmark: (noteId: string) => Promise<void>;
  removeBookmark: (noteId: string) => Promise<void>;
};

export const useNotesStore = create<NotesState>((set, get) => ({
  chapters: [],
  notes: [],
  recentNotes: [],

  selectedChapter: null,
  search: "",
  isLoading: false,

  fetchRecentNotes: async () => {
    try {
      const response = await getRecentNotes();
      set({ recentNotes: response.data });
    } catch (error) {
      console.log(error);
    }
  },
  fetchChapters: async () => {
    set({ isLoading: true });
    try {
      const response = await getChapters();
      const fetchedChapters = response.data || [];
      
      set({ chapters: fetchedChapters });

      if (fetchedChapters.length === 1) {
        await get().setSelectedChapter(fetchedChapters[0].id);
      }
    } catch (error) {
      console.log("Error fetching chapters:", error);
      set({ chapters: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchNotes: async () => {
    const { search, selectedChapter } = get();
    set({ isLoading: true });

    try {
      const response = await getNotes(
        search,
        selectedChapter ?? undefined
      );

      set({ notes: response.data });
    } catch (error) {
      console.log("Error fetching notes:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedChapter: async (chapterId) => {
    set({ selectedChapter: chapterId });
    await get().fetchNotes();
  },

  setSearch: async (search) => {
    set({ search });
    await get().fetchNotes();
  },

  bookmark: async (noteId) => {
    try {
      await bookmarkNote(noteId);
    } catch (error) {
      console.log(error);
    }
  },

  removeBookmark: async (noteId) => {
    try {
      await removeBookmark(noteId);
    } catch (error) {
      console.log(error);
    }
  },
}));