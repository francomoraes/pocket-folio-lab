export const API_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  auth: {
    login: 'auth/login',
    register: 'auth/register',
  },
} as const;