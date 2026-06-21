import { create }
from "zustand";

import {
  getWeeklyAnalytics,
} from "../services/analyticsService";

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

  isLoading: boolean;

  fetchWeeklyAnalytics:
    () => Promise<void>;
}

export const useAnalyticsStore =
  create<AnalyticsStore>(
    set => ({

      weeklyAnalytics:
        null,

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
    })
  );