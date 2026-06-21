import { create } from "zustand";

import {
  getLearningAnalytics,
} from "../services/learningAnalyticsService";

interface LearningAnalytics {

  strongestSubject: string;

  weakestSubject: string;

  notesCompletion: number;

  averageQuizScore: number;

  learningStreak: number;
}

interface LearningAnalyticsStore {

  analytics:
    LearningAnalytics | null;

  isLoading: boolean;

  fetchAnalytics:
    () => Promise<void>;
}

export const useLearningAnalyticsStore =
  create<LearningAnalyticsStore>(
    set => ({

      analytics: null,

      isLoading: false,

      fetchAnalytics:
        async () => {

          try {

            set({
              isLoading: true,
            });

            const response =
              await getLearningAnalytics();

            set({
              analytics:
                response.data,
            });

          } finally {

            set({
              isLoading: false,
            });
          }
        },
    })
  );