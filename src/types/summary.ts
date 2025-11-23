export type SummaryData = {
  assetClassName: string;
  assetTypeName: string;
  currency: "USD" | "BRL";
  totalValueCents: number;
  targetPercentage: number;
  actualPercentage: number;
};

export type OverviewData = {
  currency: "USD" | "BRL";
  totalCents: number;
  percentage: number;
  totalInUSD: number;
};
