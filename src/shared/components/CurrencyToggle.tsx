import { useTranslation } from "react-i18next";

type Currency = "BRL" | "USD";

interface CurrencyToggleProps {
  value: Currency;
  onChange: (currency: Currency) => void;
}

export const CurrencyToggle = ({ value, onChange }: CurrencyToggleProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex gap-1 bg-muted rounded p-1">
      <button
        onClick={() => onChange("BRL")}
        className={`px-2 py-1 text-xs rounded transition ${
          value === "BRL"
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
        onClick={() => onChange("USD")}
        className={`px-2 py-1 text-xs rounded transition ${
          value === "USD"
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
};
