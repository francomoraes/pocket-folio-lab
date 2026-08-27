export const API_URL = import.meta.env.VITE_API_URL;

export const API_ENDPOINTS = {
  auth: {
    login: "auth/login",
    register: "auth/register",
    refresh: "auth/refresh",
    logout: "auth/logout",
    config: "auth/config",
    updateUser: "auth/users/:id",
    uploadProfilePicture: "auth/upload-profile-picture",
  },
  assets: {
    list: "assets",
    create: "assets",
    update: "assets/:id",
    delete: "assets/:id",
    export: "assets/export",
    retryPrice: "assets/:id/retry-price",
    refreshMarketPrices: "assets/refresh-market-prices",
  },
  assetTransactions: {
    list: "asset-transactions",
    create: "asset-transactions",
    update: "asset-transactions/:transactionId",
    delete: "asset-transactions/:transactionId",
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
  cryptoAccounts: {
    list: "crypto-accounts",
    create: "crypto-accounts",
    sync: "crypto-accounts/:id/sync",
    delete: "crypto-accounts/:id",
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
  managers: {
    list: "managers",
    dashboard: "managers/me/dashboard",
    clients: "managers/me/clients",
    clientSummary: (investorId: number) =>
      `managers/me/clients/${investorId}/summary`,
    clientProfile: (investorId: number) =>
      `managers/me/clients/${investorId}/profile`,
    clientAssetTypeTargetPercentage: (
      investorId: number,
      assetTypeId: number,
    ) =>
      `managers/me/clients/${investorId}/asset-types/${assetTypeId}/target-percentage`,
    clientAutonomy: (investorId: number) =>
      `managers/me/clients/${investorId}/autonomy`,
    clientRiskProfile: (investorId: number) =>
      `managers/me/clients/${investorId}/risk-profile`,
    clientAssets: {
      list: (investorId: number) => `managers/me/clients/${investorId}/assets`,
      create: (investorId: number) => `managers/me/clients/${investorId}/assets`,
      update: (investorId: number, id: number) =>
        `managers/me/clients/${investorId}/assets/${id}`,
      delete: (investorId: number, id: number) =>
        `managers/me/clients/${investorId}/assets/${id}`,
      retryPrice: (investorId: number, id: number) =>
        `managers/me/clients/${investorId}/assets/${id}/retry-price`,
      refreshMarketPrices: (investorId: number) =>
        `managers/me/clients/${investorId}/assets/refresh-market-prices`,
    },
    clientFixedIncome: {
      list: (investorId: number) =>
        `managers/me/clients/${investorId}/fixed-income-assets`,
      create: (investorId: number) =>
        `managers/me/clients/${investorId}/fixed-income-assets`,
      update: (investorId: number, id: number) =>
        `managers/me/clients/${investorId}/fixed-income-assets/${id}`,
      delete: (investorId: number, id: number) =>
        `managers/me/clients/${investorId}/fixed-income-assets/${id}`,
    },
    clientAssetTypes: {
      list: (investorId: number) =>
        `managers/me/clients/${investorId}/asset-types`,
      create: (investorId: number) =>
        `managers/me/clients/${investorId}/asset-types`,
      update: (investorId: number, id: number) =>
        `managers/me/clients/${investorId}/asset-types/${id}`,
      delete: (investorId: number, id: number) =>
        `managers/me/clients/${investorId}/asset-types/${id}`,
    },
    clientAssetClasses: {
      list: (investorId: number) =>
        `managers/me/clients/${investorId}/asset-classes`,
      create: (investorId: number) =>
        `managers/me/clients/${investorId}/asset-classes`,
      update: (investorId: number, id: number) =>
        `managers/me/clients/${investorId}/asset-classes/${id}`,
      delete: (investorId: number, id: number) =>
        `managers/me/clients/${investorId}/asset-classes/${id}`,
    },
    clientInstitutions: {
      list: (investorId: number) =>
        `managers/me/clients/${investorId}/institutions`,
      create: (investorId: number) =>
        `managers/me/clients/${investorId}/institutions`,
      update: (investorId: number, id: number) =>
        `managers/me/clients/${investorId}/institutions/${id}`,
      delete: (investorId: number, id: number) =>
        `managers/me/clients/${investorId}/institutions/${id}`,
    },
    clientAssetTransactions: {
      list: (investorId: number) =>
        `managers/me/clients/${investorId}/asset-transactions`,
      create: (investorId: number) =>
        `managers/me/clients/${investorId}/asset-transactions`,
      update: (investorId: number, transactionId: number) =>
        `managers/me/clients/${investorId}/asset-transactions/${transactionId}`,
      delete: (investorId: number, transactionId: number) =>
        `managers/me/clients/${investorId}/asset-transactions/${transactionId}`,
    },
    clientCsv: {
      upload: (investorId: number) => `managers/me/clients/${investorId}/csv/upload-csv`,
      downloadTemplate: (investorId: number) =>
        `managers/me/clients/${investorId}/csv/csv-template`,
    },
    clientWealthHistory: {
      list: (investorId: number) =>
        `managers/me/clients/${investorId}/wealth-history`,
      create: (investorId: number) =>
        `managers/me/clients/${investorId}/wealth-history`,
      update: (investorId: number, id: number) =>
        `managers/me/clients/${investorId}/wealth-history/${id}`,
      delete: (investorId: number, id: number) =>
        `managers/me/clients/${investorId}/wealth-history/${id}`,
    },
  },
  managerLinks: {
    create: "manager-links",
    myLinks: "manager-links/me",
    myHistory: "manager-links/me/history",
    revoke: (linkId: number) => `manager-links/${linkId}/revoke`,
  },
  investors: {
    list: "investors",
  },
  admin: {
    dashboard: "admin/dashboard",
    listUsers: "admin/users",
    setRole: (userId: number) => `admin/users/${userId}/role`,
    setClientLimit: (managerId: number) =>
      `admin/managers/${managerId}/client-limit`,
  },
  users: {
    create: "users",
  },
} as const;
