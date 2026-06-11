import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY =
  "cn_master_access_token";

const REFRESH_TOKEN_KEY =
  "cn_master_refresh_token";

const USER_KEY =
  "cn-master-user";

export const saveTokens = async (
  accessToken: string,
  refreshToken: string,
  user?: any
) => {
  await SecureStore.setItemAsync(
    ACCESS_TOKEN_KEY,
    accessToken
  );

  await SecureStore.setItemAsync(
    REFRESH_TOKEN_KEY,
    refreshToken
  );

  if (user) {
    await SecureStore.setItemAsync(
      USER_KEY,
      JSON.stringify(user)
    );
  }
};

export const getTokens = async () => {
  const accessToken =
    await SecureStore.getItemAsync(
      ACCESS_TOKEN_KEY
    );

  const refreshToken =
    await SecureStore.getItemAsync(
      REFRESH_TOKEN_KEY
    );

  return {
    accessToken,
    refreshToken,
  };
};

export const getUser =
  async () => {
    const user =
      await SecureStore.getItemAsync(
        USER_KEY
      );

    return user
      ? JSON.parse(user)
      : null;
  };

export const clearTokens =
  async () => {
    await SecureStore.deleteItemAsync(
      ACCESS_TOKEN_KEY
    );

    await SecureStore.deleteItemAsync(
      REFRESH_TOKEN_KEY
    );

    await SecureStore.deleteItemAsync(
      USER_KEY
    );
  };