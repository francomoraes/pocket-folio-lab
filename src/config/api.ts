export const API_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  auth: {
    login: "auth/login",
    register: "auth/register",
  },
  assets: {
    list: "assets",
    buy: "assets/:ticker/buy",
    sell: "assets/:ticker/sell",
    update: "assets/:id",
    delete: "assets/:id",
    export: "assets/export",
  },
} as const;
