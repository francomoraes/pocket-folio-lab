export type SummaryData = {
  assetClassName: string;
  assetTypeName: string;
  currency: "USD" | "BRL";
  totalValueCents: number;
  targetPercentage: number;
  actualPercentage: number;
};

export type ExchangeRate = {
  usdToBrl: number;
  brlToUsd: number;
};

export type CashFlow = {
  netContributionCents: number;
  unreinvestedDividendsCents: number;
  totalDividendsCents: number;
};

export type SummaryResponse = {
  data: SummaryData[];
  exchangeRate: ExchangeRate;
  totalPnlCents: number;
  cashFlow: CashFlow;
};

export type OverviewData = {
  currency: "USD" | "BRL";
  totalCents: number;
  percentage: number;
  totalInUSD: number;
};
