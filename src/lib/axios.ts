import { API_URL } from "@/config/api";
import axios from "axios";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
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
    switch (error.response?.status) {
      case 401:
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        window.location.href = "/login";
        break;

      default:
        break;
    }
    return Promise.reject(error);
  },
);
