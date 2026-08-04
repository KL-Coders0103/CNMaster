import { create } from 'zustand';
import { api } from '../services/api';
import Toast from 'react-native-toast-message';
import { ChatMessage, AIFlashcard, SmartPlannerTask } from '../types';

interface AiState {
  messages: ChatMessage[];
  isTyping: boolean;
  
  flashcards: AIFlashcard[];
  isGeneratingFlashcards: boolean;
  isGeneratingEli5: boolean;
  isSyncingPlanner: boolean;

  sendMessage: (noteId: string, text: string) => Promise<void>;
  clearChat: () => void;
  explainEli5: (text: string) => Promise<string | null>;
  syncSmartPlanner: () => Promise<boolean>;
  generateFlashcards: (noteId: string) => Promise<void>;
}

export const useAiStore = create<AiState>((set, get) => ({
  messages: [],
  isTyping: false,
  flashcards: [],
  isGeneratingFlashcards: false,
  isGeneratingEli5: false,
  isSyncingPlanner: false,

  sendMessage: async (noteId: string, text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date()
    };
    
    set((state) => ({ 
      messages: [...state.messages, userMsg],
      isTyping: true 
    }));

    try {
      const res = await api.post('/ai/tutor/chat', { noteId, message: userMsg.content });
      
      if (res.data?.success) {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: res.data.reply,
          timestamp: new Date()
        };
        set((state) => ({ messages: [...state.messages, aiMsg] }));
      }
    } catch (error: any) {
      console.error("AI Chat Error", error);
      Toast.show({ type: 'error', text1: 'Tutor disconnected', text2: error.response?.data?.message || 'Try again' });
    } finally {
      set({ isTyping: false });
    }
  },

  clearChat: () => set({ messages: [] }),

  explainEli5: async (text: string) => {
    set({ isGeneratingEli5: true });
    try {
      const res = await api.post('/ai/tutor/eli5', { text });
      if (res.data?.success) return res.data.explanation;
      return null;
    } catch (error) {
      Toast.show({ type: 'error', text1: 'ELI5 Failed' });
      return null;
    } finally {
      set({ isGeneratingEli5: false });
    }
  },

  syncSmartPlanner: async () => {
    set({ isSyncingPlanner: true });
    try {
      const res = await api.post('/ai/planner/smart-sync');
      if (res.data?.success) {
        Toast.show({ type: 'success', text1: 'Smart Plan Generated!', text2: res.data.message });
        return true;
      }
      return false;
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Sync Failed' });
      return false;
    } finally {
      set({ isSyncingPlanner: false });
    }
  },

  generateFlashcards: async (noteId: string) => {
    set({ isGeneratingFlashcards: true, flashcards: [] });
    try {
      const res = await api.get(`/ai/notes/${noteId}/flashcards`);
      if (res.data?.success) {
        const cardsData = res.data.flashcards?.flashcards || res.data.flashcards;
        set({ flashcards: Array.isArray(cardsData) ? cardsData : [] });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to generate flashcards' });
    } finally {
      set({ isGeneratingFlashcards: false });
    }
  }
}));