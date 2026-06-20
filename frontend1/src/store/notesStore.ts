import { create } from "zustand";

import {
  Subject,
  Chapter,
  Note,
  RecentNote,
} from "../types/notes";

import {
  getSubjects,
  getChapters,
  getNotes,
  bookmarkNote,
  removeBookmark,
  getRecentNotes,
} from "../services/notesService";

type NotesState = {
  subjects: Subject[];
  chapters: Chapter[];
  notes: Note[];
  recentNotes: RecentNote[];

  selectedSubject: string | null;
  selectedChapter: string | null;

  search: string;
  isLoading: boolean;

  fetchSubjects: () => Promise<void>;
  fetchRecentNotes: () => Promise<void>;
  fetchChapters: (subjectId: string) => Promise<void>;
  fetchNotes: () => Promise<void>;
  setSelectedSubject: (subjectId: string | null) => Promise<void>;
  setSelectedChapter: (chapterId: string | null) => Promise<void>;
  setSearch: (search: string) => Promise<void>;
  bookmark: (noteId: string) => Promise<void>;
  removeBookmark: (noteId: string) => Promise<void>;
};

export const useNotesStore = create<NotesState>((set, get) => ({
  subjects: [],
  chapters: [],
  notes: [],
  recentNotes: [],

  selectedSubject: null,
  selectedChapter: null,
  search: "",
  isLoading: false,

  fetchSubjects: async () => {
    set({ isLoading: true });

    try {
      const response = await getSubjects();
      const fetchedSubjects = response.data || [];

      set({ subjects: fetchedSubjects });

      // Clean UX Optimization: Auto-select subject if only one exists in the database
      if (fetchedSubjects.length === 1) {
        const singleSubjectId = fetchedSubjects[0].id;
        
        set({
          selectedSubject: singleSubjectId,
          selectedChapter: null, // Reset selected chapter to clear old filters
        });

        // Fetch the corresponding chapters immediately
        await get().fetchChapters(singleSubjectId);
      }
    } catch (error) {
      console.log("Error fetching subjects:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRecentNotes: async () => {
    try {
      const response = await getRecentNotes();
      set({ recentNotes: response.data });
    } catch (error) {
      console.log(error);
    }
  },

  fetchChapters: async (subjectId) => {
    try {
      const response = await getChapters(subjectId);
      set({ chapters: response.data });
    } catch (error) {
      console.log("Error fetching chapters:", error);
      set({ chapters: [] });
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

  setSelectedSubject: async (subjectId) => {
    set({
      selectedSubject: subjectId,
      selectedChapter: null,
    });

    if (subjectId) {
      await get().fetchChapters(subjectId);
    } else {
      set({ chapters: [] });
    }

    await get().fetchNotes();
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