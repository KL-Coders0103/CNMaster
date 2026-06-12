import { create } from "zustand";
import type { User } from "../types/auth";

type AuthState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;

  isAuthenticated: boolean;
  isInitializing: boolean

  setAuth: (
    accessToken: string,
    refreshToken: string | null,
    user: User | null
  ) => void;

  clearAuth: () => void;

  setInitializing: (
    value: boolean
  ) => void;
};

export const useAuthStore =
  create<AuthState>((set) => ({
    accessToken: null,
    refreshToken: null,
    user: null,
    isAuthenticated: false,
    isInitializing: true,

    setAuth: (
      accessToken,
      refreshToken,
      user
    ) =>
      set({
        accessToken,
        refreshToken,
        user,
        isAuthenticated: true,
        isInitializing: false,
      }),

    clearAuth: () =>
      set({
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
        isInitializing: false,
      }),

    setInitializing: (
      value
    ) => set({
      isInitializing: value,
    }),

  }));