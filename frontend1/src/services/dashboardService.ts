import { api } from "../api/axios";

import {
  DashboardResponse,
} from "../types/dashboard";

export const getHomeDashboard =
  async (): Promise<DashboardResponse> => {
    const response =
      await api.get(
        "/dashboard/home"
      );

    return response.data;
  };