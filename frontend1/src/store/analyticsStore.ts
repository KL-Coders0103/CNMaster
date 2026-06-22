import { create }
from "zustand";

import {
  getWeeklyAnalytics,
} from "../services/analyticsService";
import { api } from "../api/axios";

interface WeakArea {

  id: string;

  mistakeCount: number;

  chapter: {
    id: string;
    title: string;

    subject: {
      name: string;
    };
  };
}
interface WeeklyAnalytics {
  studyHours: number;
  xpEarned: number;
  notesRead: number;
  assignmentsSubmitted: number;
  weeklyTrend: number[];
}

interface AnalyticsStore {

  weeklyAnalytics:
    WeeklyAnalytics | null;

  weakAreas:
    WeakArea[];

  isLoading: boolean;

  fetchWeeklyAnalytics:
    () => Promise<void>;

  fetchWeakAreas:
    () => Promise<void>;
}

export const useAnalyticsStore =
  create<AnalyticsStore>(
    set => ({

      weeklyAnalytics:
        null,

      weakAreas: [],

      isLoading:
        false,

      fetchWeeklyAnalytics:
        async () => {

          try {

            set({
              isLoading: true,
            });

            const response =
              await getWeeklyAnalytics();

            set({
              weeklyAnalytics:
                response.data,
            });

          } finally {

            set({
              isLoading: false,
            });
          }
        },

        fetchWeakAreas:
      async () => {

        try {

          const response =
            await api.get(
              "/analytics/weak-areas"
            );

          set({
            weakAreas:
              response.data.data,
          });

        } catch (error) {

          console.log(
            "Weak areas fetch failed",
            error
          );
        }
      },
    })
  );