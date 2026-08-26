import { useMyLinks } from "@/features/manager/hooks/useMyLinks";
import { useMyLinkHistory } from "@/features/manager/hooks/useMyLinkHistory";
import { ManagerLinkCard } from "@/features/manager/components/ManagerLinkCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
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
import CircularProgress from "@/shared/components/ui/circular-progress";

export const ManagerLinksPage = () => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage || "pt-BR";

  const { links, isLoading } = useMyLinks();
  const { history, isLoading: isLoadingHistory } = useMyLinkHistory();

  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString(locale) : "—";

  const formatWealth = (cents: number | null) =>
    cents != null ? formatCentsToCurrency(cents, "BRL") : "—";

  return (
    <div className="flex flex-col gap-6 p-4 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold">{t("managers.title")}</h1>
        <p className="text-muted-foreground text-sm">{t("managers.subtitle")}</p>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">{t("managers.myManagers")}</h2>
        {isLoading ? (
          <CircularProgress />
        ) : links.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t("managers.noLinks")}</p>
        ) : (
          <div className="flex flex-col gap-2">
            {links.map((link) => (
              <ManagerLinkCard key={link.id} link={link} />
            ))}
          </div>
        )}
      </section>

      <Accordion type="single" collapsible>
        <AccordionItem value="history" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className="font-semibold">{t("managers.history.title")}</span>
          </AccordionTrigger>
          <AccordionContent className="p-0">
            <Card className="rounded-none border-t">
              {isLoadingHistory ? (
                <div className="p-4">
                  <CircularProgress />
                </div>
              ) : history.length === 0 ? (
                <p className="p-4 text-sm text-muted-foreground">
                  {t("managers.history.noHistory")}
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("managers.history.manager")}</TableHead>
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
                          <TableCell>{fmt(cycle.cycleStartAt)}</TableCell>
                          <TableCell>{fmt(cycle.cycleEndAt)}</TableCell>
                          <TableCell>
                            {formatWealth(cycle.initialWealthCents)}
                          </TableCell>
                          <TableCell>
                            {cycle.status === "active"
                              ? formatWealth(cycle.currentWealthCents)
                              : formatWealth(cycle.finalWealthCents)}
                          </TableCell>
                          <TableCell className="capitalize">
                            {t(`linkStatus.${cycle.status}`)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
