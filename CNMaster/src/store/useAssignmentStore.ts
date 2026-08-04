import { create } from 'zustand';
import { api } from '../services/api';
import Toast from 'react-native-toast-message';
import { Assignment, AssignmentDetails, AssignmentAnalytics } from '../types';

interface Chapter {
  id: string;
  title: string;
}

interface AssignmentsState {
  assignments: Assignment[];
  upcomingAssignment: Assignment | null;
  history: any[]; 
  analytics: AssignmentAnalytics | null;
  currentAssignment: AssignmentDetails | null;
  availableChapters: Chapter[];
  isLoading: boolean;
  isSubmitting: boolean;
  searchQuery: string;
  selectedChapterId: string | null;

  setSearchQuery: (query: string) => void;
  setSelectedChapterId: (id: string | null) => void;
  
  fetchAssignments: () => Promise<void>;
  fetchUpcomingAssignment: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  fetchHistory: () => Promise<void>;
  fetchAssignmentDetails: (id: string) => Promise<void>;

  submitAssignment: (assignmentId: string, fileUri: string, fileName: string, mimeType: string) => Promise<boolean>;
  
  initializeDashboard: () => Promise<void>;
}

export const useAssignmentsStore = create<AssignmentsState>((set, get) => ({
  assignments: [],
  upcomingAssignment: null,
  history: [],
  analytics: null,
  currentAssignment: null,
  availableChapters: [],
  isLoading: false,
  isSubmitting: false,
  searchQuery: '',
  selectedChapterId: null,

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedChapterId: (id) => {
    set({ selectedChapterId: id });
    get().fetchAssignments();
  },

  fetchAssignments: async () => {
    set({ isLoading: true });
    try {
      const { searchQuery, selectedChapterId } = get();
      let endpoint = '/assignments?';
      if (searchQuery) endpoint += `search=${encodeURIComponent(searchQuery)}&`;
      if (selectedChapterId) endpoint += `chapterId=${selectedChapterId}`;

      const res = await api.get(endpoint);
      if (res.data?.success) {
        const fetchedAssignments = res.data.data;

        if (!searchQuery && !selectedChapterId) {
          const chaptersMap = new Map<string, Chapter>();
          fetchedAssignments.forEach((assignment: any) => {
            if (assignment.chapter) {
              chaptersMap.set(assignment.chapter.id, assignment.chapter);
            }
          });
          set({ availableChapters: Array.from(chaptersMap.values()) });
        }

        set({ assignments: fetchedAssignments });
      }
    } catch (error) {
      console.error("Failed to fetch assignments", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUpcomingAssignment: async () => {
    try {
      const res = await api.get('/assignments/upcoming/me');
      if (res.data?.success) {
        set({ upcomingAssignment: res.data.data });
      }
    } catch (error) {
      console.error("Failed to fetch upcoming assignment", error);
    }
  },

  fetchAnalytics: async () => {
    try {
      const res = await api.get('/assignments/analytics');
      if (res.data?.success) {
        set({ analytics: res.data.data });
      }
    } catch (error) {
      console.error("Failed to fetch assignment analytics", error);
    }
  },

  fetchHistory: async () => {
    try {
      const res = await api.get('/assignments/history/me');
      if (res.data?.success) {
        set({ history: res.data.data });
      }
    } catch (error) {
      console.error("Failed to fetch submission history", error);
    }
  },

  fetchAssignmentDetails: async (id) => {
    set({ isLoading: true, currentAssignment: null });
    try {
      const res = await api.get(`/assignments/${id}`);
      if (res.data?.success) {
        set({ currentAssignment: res.data.data });
      }
    } catch (error) {
      console.error("Failed to fetch assignment details", error);
      Toast.show({ type: 'error', text1: 'Failed to load assignment' });
    } finally {
      set({ isLoading: false });
    }
  },

  submitAssignment: async (assignmentId, fileUri, fileName, mimeType) => {
    set({ isSubmitting: true });
    try {
      const formData = new FormData();
      formData.append('submission', {
        uri: fileUri,
        name: fileName,
        type: mimeType,
      } as any);
      const res = await api.post(`/assignments/${assignmentId}/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data?.success) {
        Toast.show({ type: 'success', text1: 'Assignment submitted!' });

        await get().fetchAssignmentDetails(assignmentId);
        await get().fetchAssignments();
        
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Submission failed", error.response?.data || error);
      Toast.show({ 
        type: 'error', 
        text1: 'Submission failed', 
        text2: error.response?.data?.message || 'Please try again' 
      });
      return false;
    } finally {
      set({ isSubmitting: false });
    }
  },

  initializeDashboard: async () => {
    set({ isLoading: true });
    await Promise.all([
      get().fetchAssignments(),
      get().fetchUpcomingAssignment(),
      get().fetchAnalytics()
    ]);
    set({ isLoading: false });
  }
}));