import { ManagerDashboard } from "@/shared/types/manager";
import { Card } from "@/shared/components/ui/card";
import { formatCentsToCurrency } from "@/shared/utils/formatters";
import { useTranslation } from "react-i18next";

interface ManagerDashboardStatsProps {
  dashboard: ManagerDashboard;
}

export const ManagerDashboardStats = ({
  dashboard,
}: ManagerDashboardStatsProps) => {
  const { t } = useTranslation();

  const variationPositive = dashboard.absoluteVariationCents >= 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          {t("managerDashboard.metrics.activeClients")}
        </p>
        <p className="text-2xl font-bold">{dashboard.activeClientsCount}</p>
      </Card>

      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          {t("managerDashboard.metrics.totalWealth")}
        </p>
        <p className="text-xl font-semibold">
          {formatCentsToCurrency(
            dashboard.totalWealthUnderManagementCents,
            "BRL",
          )}
        </p>
      </Card>

      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          {t("managerDashboard.metrics.initialWealth")}
        </p>
        <p className="text-xl font-semibold">
          {formatCentsToCurrency(dashboard.totalInitialWealthCents, "BRL")}
        </p>
      </Card>

      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          {t("managerDashboard.metrics.absoluteVariation")}
        </p>
        <p
          className={`text-xl font-semibold ${
            variationPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {variationPositive ? "+" : ""}
          {formatCentsToCurrency(dashboard.absoluteVariationCents, "BRL")}
        </p>
      </Card>

      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          {t("managerDashboard.metrics.percentageVariation")}
        </p>
        <p
          className={`text-xl font-semibold ${
            variationPositive ? "text-green-600" : "text-red-600"
          }`}
        >
          {variationPositive ? "+" : ""}
          {dashboard.percentageVariation.toFixed(2)}%
        </p>
      </Card>
    </div>
  );
};
