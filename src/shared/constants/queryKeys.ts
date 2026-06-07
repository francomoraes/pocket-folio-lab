export const QUERY_KEYS = {
  ASSET_CLASSES: ["asset-classes"],
  ASSET_TYPES: ["asset-types"],
  INSTITUTIONS: ["institutions"],
  ASSETS: ["assets"],
  FIXED_INCOME_ASSETS: ["fixed-income-assets"],
  SUMMARY: ["summary"],
  OVERVIEW: ["overview"],

  availableManagers: (search?: string) => ["managers", "available", search],
  myLinks: ["manager-links", "me"] as const,
  myLinkHistory: ["manager-links", "me", "history"] as const,
  pendingLinks: ["manager-links", "pending"] as const,
  managerClients: (params?: object) => ["manager", "clients", params],
  managerDashboard: ["manager", "dashboard"] as const,
  clientSummary: (investorId: number) =>
    ["manager", "clients", investorId, "summary"] as const,
  clientAssets: (investorId: number) =>
    ["manager", "clients", investorId, "assets"] as const,
  clientFixedIncome: (investorId: number) =>
    ["manager", "clients", investorId, "fixed-income"] as const,
  clientWealthHistory: (investorId: number) =>
    ["manager", "clients", investorId, "wealth-history"] as const,
  clientProfile: (investorId: number) =>
    ["manager", "clients", investorId, "profile"] as const,
  adminUsers: (params?: object) => ["admin", "users", params],
};
