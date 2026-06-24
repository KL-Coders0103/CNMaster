import { create } from "zustand";
import { api } from "../api/axios";

export type QuizDifficulty = "EASY" | "MEDIUM" | "HARD";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  difficulty: QuizDifficulty;
}

export interface QuizAnswerPayload {
  questionId: string;
  selectedAnswer: string;
}

export interface QuizResult {
  score: number;
  totalMarks: number;
  correctAnswers: number;
  wrongAnswers: number;
  xpEarned?: number;
}

interface QuizState {
  questions: QuizQuestion[];
  attemptId: string;
  isLoading: boolean;
  dailyChallenge: any | null; 
  startQuiz: (chapterId: string, difficulty: QuizDifficulty) => Promise<any>;
  submitQuiz: (answers: QuizAnswerPayload[]) => Promise<QuizResult | undefined>; 
  fetchDailyChallenge: () => Promise<void>;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  questions: [],
  attemptId: "",
  isLoading: false,
  dailyChallenge: null,

  startQuiz: async (chapterId, difficulty) => {
    set({ isLoading: true });

    try {
      const response = await api.post("/quizzes/start", {
        chapterId,
        difficulty,
      });

      const data = response.data.data;

      if (!data.questions || data.questions.length === 0) {
        throw new Error("No questions available for this quiz format.");
      }

      set({
        questions: data.questions,
        attemptId: data.attemptId,
      });

      return data;
    } catch (error : any) {
      console.log("Backend 404 message:", error.response?.data);
      console.log("Failed to start quiz:", error);
      throw error; 
    } finally {
      set({ isLoading: false });
    }
  },

  submitQuiz: async (answers) => {
    try {
      set({ isLoading: true });
      const response = await api.post("/quizzes/submit", {
        attemptId: get().attemptId,
        answers,
      });

      return response.data.data as QuizResult; 
      
    } catch (error) {
      console.log("Failed to submit quiz:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  fetchDailyChallenge: async () => {
    try {
      const response = await api.get("/quizzes/daily-challenge");
      set({
        dailyChallenge: response.data.data,
      });
    } catch (error) {
      console.log("Failed to fetch daily challenge:", error);
    }
  },
}));