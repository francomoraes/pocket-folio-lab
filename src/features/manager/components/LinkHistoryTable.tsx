import { LinkStatusBadge } from "@/features/manager/components/LinkStatusBadge";
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
import CircularProgress from "@/shared/components/ui/circular-progress";
import { ManagerHistoryCycle } from "@/shared/types/manager";

interface LinkHistoryTableProps {
  history: ManagerHistoryCycle[];
  isLoading: boolean;
}

// Extraído de ManagerLinksPage.tsx (decisão 4.9 de
// .docs/historico-de-operacoes.md) — sem opinião sobre Accordion/título,
// quem usa decide o wrapper.
export const LinkHistoryTable = ({ history, isLoading }: LinkHistoryTableProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage || "pt-BR";

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString(locale) : "—";

  const formatWealth = (cents: number | null) =>
    cents != null ? formatCentsToCurrency(cents, "BRL") : "—";

  if (isLoading) {
    return (
      <div className="p-4">
        <CircularProgress />
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        {t("managers.history.noHistory")}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("managers.history.manager")}</TableHead>
            <TableHead>{t("managers.history.email")}</TableHead>
            <TableHead>{t("managers.history.start")}</TableHead>
            <TableHead>{t("managers.history.end")}</TableHead>
            <TableHead>{t("managers.history.initialWealth")}</TableHead>
            <TableHead>{t("managers.history.finalWealth")}</TableHead>
            <TableHead>{t("managers.history.status")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((cycle, idx) => (
            <TableRow key={idx}>
              <TableCell>{cycle.managerName}</TableCell>
              <TableCell>{cycle.managerEmail}</TableCell>
              <TableCell>{fmt(cycle.cycleStartAt)}</TableCell>
              <TableCell>{fmt(cycle.cycleEndAt)}</TableCell>
              <TableCell>{formatWealth(cycle.initialWealthCents)}</TableCell>
              <TableCell>
                {cycle.linkStatus === "active"
                  ? formatWealth(cycle.currentWealthCents)
                  : formatWealth(cycle.finalWealthCents)}
              </TableCell>
              <TableCell>
                <LinkStatusBadge status={cycle.linkStatus} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
