import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAdminDashboard } from "@/features/admin/hooks/useAdminDashboard";
import { AdminDashboardStats } from "@/features/admin/components/AdminDashboardStats";
import { ManagerRankingTable } from "@/features/admin/components/ManagerRankingTable";
import { ClientsListSection } from "@/features/manager/components/ClientsListSection";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useTranslation } from "react-i18next";
import CircularProgress from "@/shared/components/ui/circular-progress";

export const AdminDashboardPage = () => {
  const { t } = useTranslation();
  const { dashboard, isLoading } = useAdminDashboard();
  const [currency, setCurrency] = useState<"BRL" | "USD">("BRL");
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "ranking";

  const handleTabChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("tab", value);
      return next;
    });
  };

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

      <AdminDashboardStats
        dashboard={dashboard}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="ranking">{t("admin.dashboard.tabs.ranking")}</TabsTrigger>
          <TabsTrigger value="investors">
            {t("admin.dashboard.tabs.investors")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ranking" className="mt-4">
          <ManagerRankingTable
            ranking={dashboard.managerRanking}
            currency={currency}
            usdToBrlRate={dashboard.exchangeRate?.usdToBrl || 5.7}
          />
        </TabsContent>
        <TabsContent value="investors" className="mt-4">
          <ClientsListSection
            scope="all"
            currency={currency}
            usdToBrlRate={dashboard.exchangeRate?.usdToBrl || 5.7}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
