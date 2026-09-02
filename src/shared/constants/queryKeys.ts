export const QUERY_KEYS = {
  ASSET_CLASSES: ["asset-classes"],
  ASSET_TYPES: ["asset-types"],
  INSTITUTIONS: ["institutions"],
  CRYPTO_ACCOUNTS: ["crypto-accounts"],
  ASSETS: ["assets"],
  ASSET_TRANSACTIONS: ["asset-transactions"],
  FIXED_INCOME_ASSETS: ["fixed-income-assets"],
  SUMMARY: ["summary"],
  OVERVIEW: ["overview"],

  assetTransactions: (params?: object) =>
    params ? ["asset-transactions", params] : ["asset-transactions"],

  availableManagers: (search?: string) => ["managers", "available", search],
  availableInvestors: (search?: string, excludeManagerId?: number) => [
    "investors",
    "available",
    search,
    excludeManagerId,
  ],
  myLinks: ["manager-links", "me"] as const,
  myLinkHistory: ["manager-links", "me", "history"] as const,
  managerClientsRoot: ["manager", "clients"] as const,
  managerClients: (params?: object) => ["manager", "clients", params],
  managerDashboard: ["manager", "dashboard"] as const,
  clientSummary: (investorId: number) =>
    ["manager", "clients", investorId, "summary"] as const,
  clientAssets: (investorId: number) =>
    ["manager", "clients", investorId, "assets"] as const,
  clientAssetTransactions: (investorId: number, params?: object) =>
    params
      ? (["manager", "clients", investorId, "asset-transactions", params] as const)
      : (["manager", "clients", investorId, "asset-transactions"] as const),
  clientFixedIncome: (investorId: number) =>
    ["manager", "clients", investorId, "fixed-income"] as const,
  clientWealthHistory: (investorId: number) =>
    ["manager", "clients", investorId, "wealth-history"] as const,
  clientAssetTypes: (investorId: number) =>
    ["manager", "clients", investorId, "asset-types"] as const,
  clientAssetClasses: (investorId: number) =>
    ["manager", "clients", investorId, "asset-classes"] as const,
  clientInstitutions: (investorId: number) =>
    ["manager", "clients", investorId, "institutions"] as const,
  clientProfile: (investorId: number) =>
    ["manager", "clients", investorId, "profile"] as const,
  adminUsers: (params?: object) => ["admin", "users", params],
  adminDashboard: ["admin", "dashboard"] as const,

  myOperationLogs: (params?: object) =>
    params ? (["operation-logs", "me", params] as const) : (["operation-logs", "me"] as const),
  clientOperationLogs: (investorId: number, params?: object) =>
    params
      ? (["manager", "clients", investorId, "operation-logs", params] as const)
      : (["manager", "clients", investorId, "operation-logs"] as const),
  clientLinkHistory: (investorId: number) =>
    ["manager", "clients", investorId, "link-history"] as const,
};
