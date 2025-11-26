export const formatCentsToCurrency = (cents: number, currency: string) => {
  switch (currency) {
    case "BRL":
      return new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        minimumFractionDigits: 2,
      }).format(cents / 100);

    case "USD": {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
      }).format(cents / 100);
    }

    default:
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).format(cents / 100);
  }
};

export const formatCurrencyToCents = (value: number): number => {
  return Math.round(value * 100);
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(2)}%`;
};
