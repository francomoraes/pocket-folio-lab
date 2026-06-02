import { API_URL } from "@/config/api";
import axios from "axios";
import i18n from "@/shared/i18n/config";
import { tokenStore } from "@/lib/tokenStore";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true, // needed for the refresh token cookie
});

// Separate instance for the refresh call — avoids triggering the 401 interceptor recursively
const refreshApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// For use in AuthContext on mount — avoids going through the 401 interceptor
export async function tryRefreshToken(): Promise<string | null> {
  try {
    const { data } = await refreshApi.post<{ token: string }>("/auth/refresh");
    return data.token;
  } catch {
    return null;
  }
}

let isRefreshing = false;
let pendingRequests: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  pendingRequests.forEach((p) =>
    error ? p.reject(error) : p.resolve(token!),
  );
  pendingRequests = [];
}

// Adds access token to every request
api.interceptors.request.use(
  (config) => {
    const token = tokenStore.get();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handles 401 by refreshing the access token via the HttpOnly cookie
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const statusCode = error.response?.status;

    if (statusCode === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingRequests.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await refreshApi.post<{ token: string }>(
          "/auth/refresh",
        );
        tokenStore.set(data.token);
        processQueue(null, data.token);
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStore.clear();
        tokenStore.triggerLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Build informative error for consumers
    const backendMessage =
      error.response?.data?.message || error.response?.data?.error;

    let errorMessage = error.message;
    if (backendMessage) {
      errorMessage = backendMessage;
    } else if (statusCode) {
      errorMessage = `${i18n.t("common.status.error")} ${statusCode}: ${error.message}`;
    }

    const enhancedError = new Error(errorMessage);
    Object.assign(enhancedError, {
      response: error.response,
      request: error.request,
      config: error.config,
      code: error.code,
      status: statusCode,
    });

    return Promise.reject(enhancedError);
  },
);
