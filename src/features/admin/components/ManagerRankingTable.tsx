import { ManagerRankingRow } from "@/shared/types/manager";
import { Card } from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { formatCentsToCurrency } from "@/shared/utils/formatters";
import { useTranslation } from "react-i18next";

interface ManagerRankingTableProps {
  ranking: ManagerRankingRow[];
}

export const ManagerRankingTable = ({ ranking }: ManagerRankingTableProps) => {
  const { t } = useTranslation();

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("admin.dashboard.ranking.columns.manager")}</TableHead>
            <TableHead className="text-right">
              {t("admin.dashboard.ranking.columns.clients")}
            </TableHead>
            <TableHead className="text-right">
              {t("admin.dashboard.ranking.columns.wealth")}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ranking.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                {t("admin.dashboard.ranking.empty")}
              </TableCell>
            </TableRow>
          ) : (
            ranking.map((manager) => (
              <TableRow key={manager.managerId}>
                <TableCell>
                  <p className="font-medium">{manager.managerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {manager.managerEmail}
                  </p>
                </TableCell>
                <TableCell className="text-right">
                  {manager.activeClientsCount}
                </TableCell>
                <TableCell className="text-right">
                  {formatCentsToCurrency(manager.totalWealthCents, "BRL")}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
