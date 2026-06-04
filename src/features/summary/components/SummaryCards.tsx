import { Card } from "@/shared/components/ui/card";
import { formatCentsToCurrency } from "@/shared/utils/formatters";
import { useSummary } from "@/shared/hooks/useSummary";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export const SummaryCards = () => {
  const { t } = useTranslation();
  const { summary, exchangeRate, totalPnlCents } = useSummary();
  const [currency, setCurrency] = useState<"BRL" | "USD">("BRL");
  const [fading, setFading] = useState(false);

  const usdToBrlRate = exchangeRate?.usdToBrl || 5.7;

  const totalPatrimonyCents = summary?.reduce(
    (acc, item) => {
      acc[item.currency] = (acc[item.currency] || 0) + item.totalValueCents;
      return acc;
    },
    {} as Record<string, number>,
  );

  const consolidatedBRL =
    (totalPatrimonyCents?.BRL || 0) +
    (totalPatrimonyCents?.USD || 0) * usdToBrlRate;
  const consolidatedUSD = consolidatedBRL / usdToBrlRate;

  const pnlBRL = totalPnlCents ?? 0;
  const pnlUSD = Math.round(pnlBRL / usdToBrlRate);
  const pnlDisplay = currency === "BRL" ? pnlBRL : pnlUSD;
  const hasPnl = totalPnlCents !== undefined && totalPnlCents !== null;

  const handleCurrencyChange = (next: "BRL" | "USD") => {
    if (next === currency) return;
    setFading(true);
    setTimeout(() => {
      setCurrency(next);
      setFading(false);
    }, 120);
  };

  const fadeClass = `transition-opacity duration-[120ms] ${fading ? "opacity-0" : "opacity-100"}`;

  const CurrencyToggle = () => (
    <div className="flex gap-1 bg-muted rounded p-1">
      <button
        onClick={() => handleCurrencyChange("BRL")}
        className={`px-2 py-1 text-xs rounded transition ${
          currency === "BRL"
            ? "bg-primary/10 text-primary font-semibold"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title={t("positions.summary.currencyTitles.brl")}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/3022/3022546.png"
          width="14"
          alt="BRL"
          className="inline"
        />
      </button>
      <button
        onClick={() => handleCurrencyChange("USD")}
        className={`px-2 py-1 text-xs rounded transition ${
          currency === "USD"
            ? "bg-primary/10 text-primary font-semibold"
            : "text-muted-foreground hover:text-foreground"
        }`}
        title={t("positions.summary.currencyTitles.usd")}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/555/555526.png"
          width="14"
          alt="USD"
          className="inline"
        />
      </button>
    </div>
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Card className="p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-muted-foreground flex gap-1 items-center mb-1">
          {t("positions.summary.patrimonyUSD")}
          <img
            src="https://cdn-icons-png.flaticon.com/512/555/555526.png"
            width="14"
            alt="USD"
            className="inline"
          />
        </p>
        <p className="text-lg sm:text-xl font-semibold truncate">
          {formatCentsToCurrency(totalPatrimonyCents?.USD || 0, "USD")}
        </p>
      </Card>

      <Card className="p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-muted-foreground flex gap-1 items-center mb-1">
          {t("positions.summary.patrimonyBRL")}
          <img
            src="https://cdn-icons-png.flaticon.com/512/3022/3022546.png"
            width="14"
            alt="BRL"
            className="inline"
          />
        </p>
        <p className="text-lg sm:text-xl font-semibold truncate">
          {formatCentsToCurrency(totalPatrimonyCents?.BRL || 0, "BRL")}
        </p>
      </Card>

      <Card className="p-3 sm:p-4">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            {t("positions.summary.patrimony")}
          </p>
          <CurrencyToggle />
        </div>
        <p className={`text-xl sm:text-2xl font-bold text-primary truncate ${fadeClass}`}>
          {formatCentsToCurrency(
            currency === "BRL" ? consolidatedBRL : consolidatedUSD,
            currency,
          )}
        </p>
      </Card>

      {hasPnl && (
        <Card className="p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">
            {t("positions.summary.pnlBalance")}
          </p>
          <p
            className={`text-lg sm:text-xl font-semibold truncate ${fadeClass} ${
              pnlDisplay >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {pnlDisplay < 0 ? "- " : ""}
            {formatCentsToCurrency(Math.abs(pnlDisplay), currency)}
          </p>
        </Card>
      )}
    </div>
  );
};
