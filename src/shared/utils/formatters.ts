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

export const formatQuantity = (value: number): string => {
  // Use up to 8 decimal places for precision (e.g. BTC), strip trailing zeros,
  // but always show at least 2 decimal places for whole-number-like quantities.
  const str = Number(value)
    .toFixed(8)
    .replace(/(\.\d*?)0+$/, "$1")
    .replace(/\.$/, "");
  // Ensure at least 2 decimal places for display consistency
  const dotIndex = str.indexOf(".");
  if (dotIndex === -1) return `${str}.00`;
  const decimals = str.length - dotIndex - 1;
  if (decimals < 2) return str.padEnd(str.length + (2 - decimals), "0");
  return str;
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
