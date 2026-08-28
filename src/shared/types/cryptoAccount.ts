export interface CryptoAccount {
  id: number;
  type: "mercado_bitcoin";
  label: string | null;
  institutionId: number;
  assetTypeId: number;
  status: "active" | "error" | "disabled";
  lastSyncedAt: string | null;
  lastSyncError: string | null;
}

export interface ConnectCryptoAccountRequest {
  type: "mercado_bitcoin";
  label?: string;
  institutionId: number;
  assetType: string;
  apiKey: string;
  apiSecret: string;
}
