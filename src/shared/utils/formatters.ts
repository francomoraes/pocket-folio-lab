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

export const getPercentageColor = (percentage: number): string => {
  if (percentage.toPrecision(2) === "1.0") return "text-green-600";
  if (percentage > 0 && percentage < 1) return "text-orange-600";
  return "text-red-600";
};

export const getPercentageBgColor = (percentage: number): string => {
  if (percentage.toPrecision(2) === "1.0")
    return "bg-green-50 border-green-500";
  if (percentage > 0 && percentage < 1) return "bg-orange-50 border-orange-500";
  return "bg-red-50 border-red-500";
};
