export type AssetTransactionType = "buy" | "sell" | "dividend";

export interface AssetTransaction {
  id: number;
  assetId: number;
  type: AssetTransactionType;
  date: string;
  quantity: number | null;
  unitPriceCents: number | null;
  feesCents: number;
  totalAmountCents: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateAssetTransactionRequest = (
  | { assetId: number }
  | {
      ticker: string;
      assetTypeName: string;
      institutionId: number;
      currency: "BRL" | "USD";
    }
) &
  (
    | {
        type: "buy" | "sell";
        date: string;
        quantity: number;
        unitPriceCents: number;
        feesCents?: number;
      }
    | { type: "dividend"; date: string; totalAmountCents: number }
  );

export type UpdateAssetTransactionRequest =
  | {
      type: "buy" | "sell";
      date: string;
      quantity: number;
      unitPriceCents: number;
      feesCents?: number;
    }
  | { type: "dividend"; date: string; totalAmountCents: number };

export interface AssetTransactionListParams {
  assetId?: number;
  type?: AssetTransactionType;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  itemsPerPage?: number;
  sortBy?: string;
  order?: "ASC" | "DESC";
}
