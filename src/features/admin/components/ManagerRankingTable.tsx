import { useMemo, useState } from "react";
import { ManagerRankingRow } from "@/shared/types/manager";
import { Card } from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { SortableTableHead } from "@/shared/components/ui/sortable-table-head";
import {
  formatCentsToCurrency,
  formatVariation,
  getVariationColor,
} from "@/shared/utils/formatters";
import { useTranslation } from "react-i18next";

interface ManagerRankingTableProps {
  ranking: ManagerRankingRow[];
}

type SortKey =
  | "manager"
  | "clients"
  | "wealth"
  | "initialWealth"
  | "absoluteVariation"
  | "percentageVariation";
type SortOrder = "ASC" | "DESC";

const SORT_VALUE: Record<SortKey, (row: ManagerRankingRow) => string | number> = {
  manager: (row) => row.managerName.toLowerCase(),
  clients: (row) => row.activeClientsCount,
  wealth: (row) => row.totalWealthCents,
  initialWealth: (row) => row.totalInitialWealthCents,
  absoluteVariation: (row) => row.absoluteVariationCents,
  percentageVariation: (row) => row.percentageVariation,
};

export const ManagerRankingTable = ({ ranking }: ManagerRankingTableProps) => {
  const { t } = useTranslation();
  const [sortBy, setSortBy] = useState<SortKey>("wealth");
  const [order, setOrder] = useState<SortOrder>("DESC");

  const toggleSort = (key: string) => {
    if (key === sortBy) {
      setOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
    } else {
      setSortBy(key as SortKey);
      setOrder("DESC");
    }
  };

  const sortedRanking = useMemo(() => {
    const getValue = SORT_VALUE[sortBy];
    const factor = order === "ASC" ? 1 : -1;

    return [...ranking].sort((a, b) => {
      const valueA = getValue(a);
      const valueB = getValue(b);
      if (valueA < valueB) return -1 * factor;
      if (valueA > valueB) return 1 * factor;
      return 0;
    });
  }, [ranking, sortBy, order]);

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <SortableTableHead
              label={t("admin.dashboard.ranking.columns.manager")}
              sortKey="manager"
              currentSortBy={sortBy}
              currentOrder={order}
              onSort={toggleSort}
            />
            <SortableTableHead
              label={t("admin.dashboard.ranking.columns.clients")}
              sortKey="clients"
              currentSortBy={sortBy}
              currentOrder={order}
              onSort={toggleSort}
              className="text-right"
            />
            <SortableTableHead
              label={t("admin.dashboard.ranking.columns.wealth")}
              sortKey="wealth"
              currentSortBy={sortBy}
              currentOrder={order}
              onSort={toggleSort}
              className="text-right"
            />
            <SortableTableHead
              label={t("admin.dashboard.ranking.columns.initialWealth")}
              sortKey="initialWealth"
              currentSortBy={sortBy}
              currentOrder={order}
              onSort={toggleSort}
              className="text-right"
            />
            <SortableTableHead
              label={t("admin.dashboard.ranking.columns.absoluteVariation")}
              sortKey="absoluteVariation"
              currentSortBy={sortBy}
              currentOrder={order}
              onSort={toggleSort}
              className="text-right"
            />
            <SortableTableHead
              label={t("admin.dashboard.ranking.columns.percentageVariation")}
              sortKey="percentageVariation"
              currentSortBy={sortBy}
              currentOrder={order}
              onSort={toggleSort}
              className="text-right"
            />
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedRanking.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                {t("admin.dashboard.ranking.empty")}
              </TableCell>
            </TableRow>
          ) : (
            sortedRanking.map((manager) => {
              const variationPositive = manager.absoluteVariationCents >= 0;

              return (
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
                  <TableCell className="text-right">
                    {formatCentsToCurrency(manager.totalInitialWealthCents, "BRL")}
                  </TableCell>
                  <TableCell
                    className={`text-right ${
                      variationPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {variationPositive ? "+" : ""}
                    {formatCentsToCurrency(manager.absoluteVariationCents, "BRL")}
                  </TableCell>
                  <TableCell
                    className={`text-right ${getVariationColor(manager.percentageVariation)}`}
                  >
                    {formatVariation(manager.percentageVariation)}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </Card>
  );
};
