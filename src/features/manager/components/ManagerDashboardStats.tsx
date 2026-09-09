import { ManagerDashboard } from "@/shared/types/manager";
import { Card } from "@/shared/components/ui/card";
import { CurrencyToggle } from "@/shared/components/CurrencyToggle";
import {
  formatCentsToCurrency,
  formatVariation,
  getVariationColor,
} from "@/shared/utils/formatters";
import { useTranslation } from "react-i18next";

type ManagerDashboardStatsDashboard = Pick<
  ManagerDashboard,
  | "activeClientsCount"
  | "totalWealthUnderManagementCents"
  | "totalInitialWealthCents"
  | "absoluteVariationCents"
  | "percentageVariation"
  | "exchangeRate"
>;

interface ManagerDashboardStatsProps {
  dashboard: ManagerDashboardStatsDashboard;
  currency: "BRL" | "USD";
  onCurrencyChange: (currency: "BRL" | "USD") => void;
}

export const ManagerDashboardStats = ({
  dashboard,
  currency,
  onCurrencyChange,
}: ManagerDashboardStatsProps) => {
  const { t } = useTranslation();

  const usdToBrlRate = dashboard.exchangeRate?.usdToBrl || 5.7;
  const toDisplay = (cents: number) =>
    currency === "BRL" ? cents : Math.round(cents / usdToBrlRate);

  return (
    <>
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          {t("managerDashboard.metrics.activeClients")}
        </p>
        <p className="text-2xl font-bold">{dashboard.activeClientsCount}</p>
      </Card>

      <Card className="p-4">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-sm text-muted-foreground">
            {t("managerDashboard.metrics.totalWealth")}
          </p>
          <CurrencyToggle value={currency} onChange={onCurrencyChange} />
        </div>
        <p className="text-xl font-semibold">
          {formatCentsToCurrency(
            toDisplay(dashboard.totalWealthUnderManagementCents),
            currency,
          )}
        </p>
        <p className={`text-sm ${getVariationColor(dashboard.percentageVariation)}`}>
          {dashboard.absoluteVariationCents < 0 ? "- " : "+"}
          {formatCentsToCurrency(
            Math.abs(toDisplay(dashboard.absoluteVariationCents)),
            currency,
          )}{" "}
          · {formatVariation(dashboard.percentageVariation)}
        </p>
      </Card>

      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          {t("managerDashboard.metrics.initialWealth")}
        </p>
        <p className="text-xl font-semibold">
          {formatCentsToCurrency(
            toDisplay(dashboard.totalInitialWealthCents),
            currency,
          )}
        </p>
      </Card>
    </>
  );
};
