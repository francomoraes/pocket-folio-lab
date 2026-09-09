import { AdminDashboard } from "@/shared/types/manager";
import { Card } from "@/shared/components/ui/card";
import { ManagerDashboardStats } from "@/features/manager/components/ManagerDashboardStats";
import { useTranslation } from "react-i18next";

interface AdminDashboardStatsProps {
  dashboard: AdminDashboard;
  currency: "BRL" | "USD";
  onCurrencyChange: (currency: "BRL" | "USD") => void;
}

export const AdminDashboardStats = ({
  dashboard,
  currency,
  onCurrencyChange,
}: AdminDashboardStatsProps) => {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">
          {t("admin.dashboard.metrics.managersCount")}
        </p>
        <p className="text-2xl font-bold">{dashboard.managersCount}</p>
      </Card>

      <ManagerDashboardStats
        dashboard={dashboard}
        currency={currency}
        onCurrencyChange={onCurrencyChange}
      />
    </div>
  );
};
