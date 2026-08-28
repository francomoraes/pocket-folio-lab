import { useAdminDashboard } from "@/features/admin/hooks/useAdminDashboard";
import { AdminDashboardStats } from "@/features/admin/components/AdminDashboardStats";
import { ManagerRankingTable } from "@/features/admin/components/ManagerRankingTable";
import { useTranslation } from "react-i18next";
import CircularProgress from "@/shared/components/ui/circular-progress";

export const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const { dashboard, isLoading } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <CircularProgress />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="p-4">
        <p className="text-muted-foreground">{t("admin.dashboard.empty")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h1 className="text-2xl font-bold">{t("admin.dashboard.title")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("admin.dashboard.subtitle")}
        </p>
      </div>

      <AdminDashboardStats dashboard={dashboard} />

      <section>
        <h2 className="text-lg font-semibold mb-3">
          {t("admin.dashboard.ranking.title")}
        </h2>
        <ManagerRankingTable ranking={dashboard.managerRanking} />
      </section>
    </div>
  );
};
