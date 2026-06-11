import { create } from "zustand";

type User = {
  id: string;
  fullName: string;
  email: string;
  mobileNumber?: string | null;
  role: string;
  provider: "email" | "google";
  googleId?: string | null;
  year?: string | null;
  branch?: string | null;
  section?: string | null;
  isProfileCompleted: boolean;
};

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
      }),

    clearAuth: () =>
      set({
        accessToken: null,
        refreshToken: null,
        user: null,
        isAuthenticated: false,
      }),

    setInitializing: (
      value
    ) => set({
      isInitializing: value,
    }),

  }));