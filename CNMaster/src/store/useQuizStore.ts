import { create } from 'zustand';
import { api } from '../services/api';
import Toast from 'react-native-toast-message';
import { QuizQuestion, QuizAttempt, QuizResult, QuizDifficulty } from '../types';

interface QuizState {
  activeAttemptId: string | null;
  questions: QuizQuestion[];
  answers: Record<string, string>; 
  history: QuizAttempt[];
  currentResult: QuizResult | null;
  
  isLoading: boolean;
  isSubmitting: boolean;

  startQuiz: (chapterId: string, difficulty: QuizDifficulty) => Promise<boolean>;
  selectAnswer: (questionId: string, answer: string) => void;
  submitQuiz: () => Promise<QuizResult | null>;
  fetchHistory: () => Promise<void>;
  fetchResult: (attemptId: string) => Promise<void>;
  clearActiveQuiz: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  activeAttemptId: null,
  questions: [],
  answers: {},
  history: [],
  currentResult: null,
  
  isLoading: false,
  isSubmitting: false,

  startQuiz: async (chapterId, difficulty) => {
    set({ isLoading: true, activeAttemptId: null, questions: [], answers: {} });
    try {
      const res = await api.post('/quiz/start', { chapterId, difficulty });
      if (res.data?.success) {
        set({ 
          activeAttemptId: res.data.data.attemptId, 
          questions: res.data.data.questions 
        });
        return true;
      }
      return false;
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Failed to start quiz', text2: error.response?.data?.message });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  selectAnswer: (questionId, answer) => {
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer }
    }));
  },

  submitQuiz: async () => {
    const { activeAttemptId, answers } = get();
    if (!activeAttemptId) return null;

    set({ isSubmitting: true });
    try {
      const payloadAnswers = Object.entries(answers).map(([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer
      }));

      const res = await api.post('/quiz/submit', { 
        attemptId: activeAttemptId, 
        answers: payloadAnswers 
      });

      if (res.data?.success) {
        const result = res.data.data;
        set({ currentResult: result, activeAttemptId: null, questions: [], answers: {} });
        return result;
      }
      return null;
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Submission failed', text2: error.response?.data?.message });
      return null;
    } finally {
      set({ isSubmitting: false });
    }
  },

  fetchHistory: async () => {
    set({ isLoading: true });
    try {
      const res = await api.get('/quiz/history');
      if (res.data?.success) set({ history: res.data.data });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchResult: async (attemptId) => {
    set({ isLoading: true });
    try {
      const res = await api.get(`/quiz/result/${attemptId}`);
      if (res.data?.success) set({ currentResult: res.data.data });
    } finally {
      set({ isLoading: false });
    }
  },

  clearActiveQuiz: () => {
    set({ activeAttemptId: null, questions: [], answers: {}, currentResult: null });
  }
}));