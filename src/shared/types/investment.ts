export type OperationType = "buy" | "sell";

export type AssetClass = "stocks" | "fiis" | "fixed_income";

export type AssetType =
  | "post_fixed"
  | "inflation"
  | "pre_fixed"
  | "stock"
  | "fii";

export interface Transaction {
  id: string;
  ticker: string;
  operation: OperationType;
  assetClass: AssetClass;
  assetType: AssetType;
  quantity: number;
  price: number;
  date: string;
  createdAt: string;
}

export interface Position {
  ticker: string;
  assetClass: AssetClass;
  assetType: AssetType;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  totalValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

export interface AllocationByClass {
  class: string;
  type: string;
  currency?: string;
  actualPercentage?: number;
  targetPercentage?: number;
  actualValue?: number;
  targetValue?: number;
}

export interface AllocationByTicker {
  ticker: string;
  value: number;
  percentage: number;
}

export interface PatrimonyEvolution {
  date: string;
  value: number;
}
