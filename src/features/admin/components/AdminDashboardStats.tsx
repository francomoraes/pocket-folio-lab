import { AdminDashboard } from "@/shared/types/manager";
import { Card } from "@/shared/components/ui/card";
import { formatCentsToCurrency } from "@/shared/utils/formatters";
import { useTranslation } from "react-i18next";

interface AdminDashboardStatsProps {
  dashboard: AdminDashboard;
}

export const AdminDashboardStats = ({ dashboard }: AdminDashboardStatsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          {t("admin.dashboard.metrics.managersCount")}
        </p>
        <p className="text-2xl font-bold">{dashboard.managersCount}</p>
      </Card>

      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          {t("admin.dashboard.metrics.activeClients")}
        </p>
        <p className="text-2xl font-bold">{dashboard.totalActiveClientsCount}</p>
      </Card>

      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          {t("admin.dashboard.metrics.totalWealth")}
        </p>
        <p className="text-xl font-semibold">
          {formatCentsToCurrency(
            dashboard.totalWealthUnderManagementCents,
            "BRL",
          )}
        </p>
      </Card>
    </div>
  );
};
