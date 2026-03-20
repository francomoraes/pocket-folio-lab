import { API_URL } from "@/config/api";
import axios from "axios";
import i18n from "@/shared/i18n/config";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 seconds
});

// Adds token to every requisition
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Treats response errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Extract error message from backend response
    const backendMessage =
      error.response?.data?.message || error.response?.data?.error;
    const statusCode = error.response?.status;

    // Create a more informative error message
    let errorMessage = error.message;
    if (backendMessage) {
      errorMessage = backendMessage;
    } else if (statusCode) {
      errorMessage = `${i18n.t("common.status.error")} ${statusCode}: ${error.message}`;
    }

    // Create a new error with the backend message
    const enhancedError = new Error(errorMessage);
    // Preserve original error properties
    Object.assign(enhancedError, {
      response: error.response,
      request: error.request,
      config: error.config,
      code: error.code,
      status: statusCode,
    });

    switch (statusCode) {
      case 401:
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        window.location.href = "/login";
        break;

      default:
        break;
    }

    return Promise.reject(enhancedError);
  },
);
