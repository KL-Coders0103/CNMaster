import {
  clearTokens,
  getTokens,
  getUser,
  saveTokens,
} from "../utils/secureStorage";

import {
  refreshAccessToken,
} from "./authService";

import {
  useAuthStore,
} from "../store/authStore";

export const initializeAuth =
  async () => {
    const {
      setAuth,
      clearAuth,
      setInitializing,
    } =
      useAuthStore.getState();

    try {
      const tokens =
        await getTokens();

      const user =
        await getUser();

      if (
        !tokens.refreshToken ||
        !user
      ) {
        clearAuth();

        return;
      }

      const response =
        await refreshAccessToken({
          refreshToken:
            tokens.refreshToken,
        });

      await saveTokens(
        response.data.accessToken,
        tokens.refreshToken,
        user
      );

      setAuth(
        response.data.accessToken,
        tokens.refreshToken,
        user
      );
    } catch {
      await clearTokens();

      clearAuth();
    } finally {
      setInitializing(false);
    }
  };