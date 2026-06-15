import { create } from "zustand";

import {
  DashboardResponse,
} from "../types/dashboard";

import {
  getHomeDashboard,
} from "../services/dashboardService";

type DashboardState = {
  dashboard:
    DashboardResponse["data"] | null;

  isLoading: boolean;

  error: string | null;

  fetchDashboard: () => Promise<void>;

  clearDashboard: () => void;
};

export const useDashboardStore =
  create<DashboardState>(
    (set) => ({
      dashboard: null,

      isLoading: false,

      error: null,

      fetchDashboard:
        async () => {
          try {
            set({
              isLoading: true,
              error: null,
            });

            const response =
              await getHomeDashboard();

            set({
              dashboard:
                response.data,

              isLoading: false,
            });
          } catch (
            error: any
          ) {
            set({
              error:
                error?.response
                  ?.data
                  ?.message ??
                "Failed to load dashboard",

              isLoading: false,
            });
          }
        },

      clearDashboard:
        () =>
          set({
            dashboard: null,
            error: null,
          }),
    })
  );