export const API_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  auth: {
    login: "auth/login",
    register: "auth/register",
    updateUser: "auth/users/:id",
    uploadProfilePicture: "auth/upload-profile-picture",
  },
  assets: {
    list: "assets",
    create: "assets",
    update: "assets/:id",
    delete: "assets/:id",
    export: "assets/export",
    refreshMarketPrices: "assets/refresh-market-prices",
  },
  fixedIncomeAssets: {
    list: "fixed-income-assets",
    create: "fixed-income-assets",
    update: "fixed-income-assets/:id",
    delete: "fixed-income-assets/:id",
  },
  summary: {
    get: "summary",
    overviewByCurrency: "summary/overview",
  },
  assetClasses: {
    list: "asset-class",
    create: "asset-class",
    get: "asset-class/:id",
    update: "asset-class/:id",
    delete: "asset-class/:id",
  },
  assetTypes: {
    list: "asset-type",
    create: "asset-type",
    get: "asset-type/:id",
    update: "asset-type/:id",
    delete: "asset-type/:id",
  },
  institutions: {
    list: "institutions",
    create: "institutions",
    get: "institutions/:id",
    update: "institutions/:id",
    delete: "institutions/:id",
  },
  csv: {
    upload: "csv/upload-csv",
    downloadTemplate: "csv/csv-template",
  },
  wealthHistory: {
    list: "wealth-history",
    create: "wealth-history",
    update: "wealth-history/:id",
    delete: "wealth-history/:id",
  },
} as const;
