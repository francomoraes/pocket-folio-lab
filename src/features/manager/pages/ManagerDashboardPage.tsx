import { useManagerDashboard } from "@/features/manager/hooks/useManagerDashboard";
import { ManagerDashboardStats } from "@/features/manager/components/ManagerDashboardStats";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Card } from "@/shared/components/ui/card";
import { formatCentsToCurrency } from "@/shared/utils/formatters";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@/shared/components/ui/circular-progress";

export const ManagerDashboardPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { dashboard, isLoading } = useManagerDashboard();

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
        <p className="text-muted-foreground">{t("managerDashboard.empty")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-4">
      <div>
        <h1 className="text-2xl font-bold">{t("managerDashboard.title")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("managerDashboard.subtitle")}
        </p>
      </div>

      <ManagerDashboardStats dashboard={dashboard} />

      {dashboard.topInvestors.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">
            {t("managerDashboard.topInvestors.title")}
          </h2>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("managerDashboard.topInvestors.rank")}</TableHead>
                  <TableHead>{t("managerDashboard.topInvestors.name")}</TableHead>
                  <TableHead className="text-right">
                    {t("managerDashboard.topInvestors.wealth")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dashboard.topInvestors.map((investor, idx) => (
                  <TableRow
                    key={investor.investorId}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() =>
                      navigate(
                        `/manager/clients/${investor.investorId}/dashboard`,
                      )
                    }
                  >
                    <TableCell className="font-medium">{idx + 1}</TableCell>
                    <TableCell>{investor.name}</TableCell>
                    <TableCell className="text-right">
                      {formatCentsToCurrency(investor.currentWealthCents, "BRL")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </section>
      )}
    </div>
  );
};
