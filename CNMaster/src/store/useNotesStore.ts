import { create } from 'zustand';
import { api } from '../services/api';
import { Chapter, NoteSummary, RecentNoteProgress, NoteDetails } from '../types';
import Toast from 'react-native-toast-message';

interface NotesState {
  chapters: Chapter[];
  notes: NoteSummary[];
  recentNotes: RecentNoteProgress[];

  currentNote: NoteDetails | null;
  currentProgress: { currentPage: number; totalPages: number } | null;
  isLoading: boolean;
  isReaderLoading: boolean;
  searchQuery: string;
  selectedChapterId: string | null;
  
  setSearchQuery: (query: string) => void;
  setSelectedChapterId: (id: string | null) => void;
  fetchChapters: () => Promise<void>;
  fetchNotes: () => Promise<void>;
  fetchRecentNotes: () => Promise<void>;
  initializeNotes: () => Promise<void>;

  fetchNoteDetails: (noteId: string) => Promise<void>;
  saveProgress: (noteId: string, currentPage: number, totalPages: number) => Promise<void>;
  toggleBookmark: (noteId: string) => Promise<void>;
  recordDownload: (noteId: string) => Promise<void>;
  clearCurrentNote: () => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  chapters: [],
  notes: [],
  recentNotes: [],
  currentNote: null,
  currentProgress: null,
  isLoading: true,
  isReaderLoading: true,
  searchQuery: '',
  selectedChapterId: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedChapterId: (id) => {
    set({ selectedChapterId: id });
    get().fetchNotes();
  },

  fetchChapters: async () => {
    try {
      const res = await api.get('/notes/chapters');
      if (res.data?.success) set({ chapters: res.data.data });
    } catch (error) {
      console.error("Failed to fetch chapters", error);
    }
  },

  fetchNotes: async () => {
    set({ isLoading: true });
    try {
      const { searchQuery, selectedChapterId } = get();
      let endpoint = '/notes?limit=50';
      if (searchQuery) endpoint += `&search=${encodeURIComponent(searchQuery)}`;
      if (selectedChapterId) endpoint += `&chapterId=${selectedChapterId}`;

      const res = await api.get(endpoint);
      if (res.data?.success) set({ notes: res.data.data });
    } catch (error) {
      console.error("Failed to fetch notes", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchRecentNotes: async () => {
    try {
      const res = await api.get('/notes/recent');
      if (res.data?.success) set({ recentNotes: res.data.data });
    } catch (error) {
      console.error("Failed to fetch recent notes", error);
    }
  },

  initializeNotes: async () => {
    set({ isLoading: true });
    await Promise.all([
      get().fetchChapters(),
      get().fetchRecentNotes(),
      get().fetchNotes()
    ]);
    set({ isLoading: false });
  },

  fetchNoteDetails: async (noteId) => {
    set({ isReaderLoading: true, currentNote: null, currentProgress: null });
    try {
      const [detailsRes, progressRes] = await Promise.all([
        api.get(`/notes/${noteId}`),
        api.get(`/notes/${noteId}/progress`)
      ]);

      if (detailsRes.data?.success) {
        set({ currentNote: detailsRes.data.data });
      }
      if (progressRes.data?.success && progressRes.data.data) {
        set({ 
          currentProgress: {
            currentPage: progressRes.data.data.currentPage,
            totalPages: progressRes.data.data.totalPages
          }
        });
      }
    } catch (error) {
      console.error("Failed to fetch note details", error);
      Toast.show({ type: 'error', text1: 'Could not load note' });
    } finally {
      set({ isReaderLoading: false });
    }
  },

  saveProgress: async (noteId, currentPage, totalPages) => {
    set({ currentProgress: { currentPage, totalPages } });
    try {
      await api.post(`/notes/${noteId}/progress`, { currentPage, totalPages });
    } catch (error) {
      console.error("Failed to save progress", error);
    }
  },

  toggleBookmark: async (noteId) => {
    const note = get().currentNote;
    if (!note) return;

    const isNowBookmarked = !note.isBookmarked;
    set({ currentNote: { ...note, isBookmarked: isNowBookmarked } });

    try {
      if (isNowBookmarked) {
        await api.post(`/notes/${noteId}/bookmark`);
        Toast.show({ type: 'success', text1: 'Added to bookmarks' });
      } else {
        await api.delete(`/notes/${noteId}/bookmark`);
        Toast.show({ type: 'success', text1: 'Removed from bookmarks' });
      }
    } catch (error) {
      set({ currentNote: { ...note, isBookmarked: !isNowBookmarked } });
      Toast.show({ type: 'error', text1: 'Failed to update bookmark' });
    }
  },

  recordDownload: async (noteId) => {
    try {
      await api.post(`/notes/${noteId}/download`);
    } catch (error) {
      console.error("Failed to register download", error);
    }
  },

  clearCurrentNote: () => {
    set({ currentNote: null, currentProgress: null });
  }
}));