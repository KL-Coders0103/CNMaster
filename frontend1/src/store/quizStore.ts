import { create } from "zustand";
import { api } from "../api/axios";

interface QuizState {
  questions: any[];
  attemptId: string;
  isLoading: boolean;
  startQuiz: (chapterId: string, difficulty: string) => Promise<any>;
  submitQuiz: (answers: any[]) => Promise<void>;
  dailyChallenge: any | null;
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

      // DEFENSE 2: Actively reject the promise if no questions exist
      if (!data.questions || data.questions.length === 0) {
        throw new Error("No questions available for this quiz format.");
      }

      set({
        questions: data.questions,
        attemptId: data.attemptId,
      });

      return data;
    } catch (error) {
      console.log("Failed to start quiz:", error);
      throw error; // Bubble error to component so the UI can catch it
    } finally {
      set({ isLoading: false });
    }
  },

  submitQuiz: async (answers) => {
    try {
      await api.post("/quizzes/submit", {
        attemptId: get().attemptId,
        answers,
      });
    } catch (error) {
      console.log("Failed to submit quiz:", error);
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