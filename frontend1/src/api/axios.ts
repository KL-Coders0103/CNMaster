import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

import {
  getTokens,
  saveTokens,
  clearTokens,
  getUser,
} from "../utils/secureStorage";

import {
  useAuthStore,
} from "../store/authStore";

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const api =
  axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-Type":
        "application/json",
    },
    timeout: 10000,
  });

let isRefreshing = false;

let failedQueue: {
  resolve: (
    value?: unknown
  ) => void;

  reject: (
    reason?: any
  ) => void;
}[] = [];

const processQueue = (
  error: any,
  token: string | null
) => {
  failedQueue.forEach(
    (promise) => {
      if (error) {
        promise.reject(
          error
        );
      } else {
        promise.resolve(
          token
        );
      }
    }
  );

  failedQueue = [];
};

api.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ) => {
    const {
      accessToken,
    } =
      await getTokens();

    if (
      accessToken &&
      config.headers
    ) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  }
);

api.interceptors.response.use(
  (response) =>
    response,

  async (
    error: AxiosError
  ) => {
    const originalRequest =
      error.config as any;

    if (
      error.response?.status !==
        401 ||
      originalRequest?._retry
    ) {
      return Promise.reject(
        error
      );
    }

    if (
      isRefreshing
    ) {
      return new Promise(
        (
          resolve,
          reject
        ) => {
          failedQueue.push(
            {
              resolve,
              reject,
            }
          );
        }
      ).then(
        (
          token
        ) => {
          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${token}`,
          };

          return api(
            originalRequest
          );
        }
      );
    }

    originalRequest._retry =
      true;

    isRefreshing = true;

    try {
      const {
        refreshToken,
      } =
        await getTokens();

      if (
        !refreshToken
      ) {
        throw new Error(
          "No refresh token"
        );
      }

      const response =
        await axios.post(
          `${BASE_URL}/auth/refresh-token`,
          {
            refreshToken,
          }
        );

      const newAccessToken =
        response.data
          .data
          .accessToken;

      const storedUser =
        await getUser();

      await saveTokens(
        newAccessToken,
        refreshToken,
        storedUser ?? undefined
      );

      if (storedUser) {
        useAuthStore
          .getState()
          .setAuth(
            newAccessToken,
            refreshToken,
            storedUser
          );
      }

      processQueue(
        null,
        newAccessToken
      );

      originalRequest.headers = {
        ...originalRequest.headers,
        Authorization: `Bearer ${newAccessToken}`,
      };

      return api(
        originalRequest
      );
    } catch (
      refreshError
    ) {
      processQueue(
        refreshError,
        null
      );

      await clearTokens();

      useAuthStore
        .getState()
        .clearAuth();

      return Promise.reject(
        refreshError
      );
    } finally {
      isRefreshing =
        false;
    }
  }
);