import { clearTokens, getTokens, getUser, saveTokens } from "../utils/secureStorage";
import { refreshAccessToken } from "./authService";
import { useAuthStore } from "../store/authStore";

export const initializeAuth = async () => {
  const { setAuth, clearAuth, setInitializing } = useAuthStore.getState();

  try {
    const tokens = await getTokens();
    const localUser = await getUser();

    if (!tokens.refreshToken || !localUser) {
      clearAuth();
      return;
    }
    
    const response = await refreshAccessToken({
      refreshToken: tokens.refreshToken,
    });

    const newAccessToken = response.data.accessToken;
    const freshUser = response.data.user || localUser;

    await saveTokens(newAccessToken, tokens.refreshToken, freshUser);
    setAuth(newAccessToken, tokens.refreshToken, freshUser);

  } catch {
    await clearTokens();
    clearAuth();
  } finally {
    setInitializing(false);
  }
};