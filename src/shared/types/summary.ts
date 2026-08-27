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

export type AdherenceByType = {
  assetTypeId: number;
  assetTypeName: string;
  assetClassId: number;
  assetClassName: string;
  targetPercentage: number;
  actualPercentage: number;
  deviationPp: number;
};

export type AdherenceByClass = {
  assetClassId: number;
  assetClassName: string;
  targetPercentage: number;
  actualPercentage: number;
  deviationPp: number;
};

export type Adherence = {
  byType: AdherenceByType[];
  byClass: AdherenceByClass[];
  totalPp: number | null;
};

export type SummaryResponse = {
  data: SummaryData[];
  exchangeRate: ExchangeRate;
  totalPnlCents: number;
  cashFlow: CashFlow;
  adherence: Adherence;
};

export type OverviewData = {
  currency: "USD" | "BRL";
  totalCents: number;
  percentage: number;
  totalInUSD: number;
};
