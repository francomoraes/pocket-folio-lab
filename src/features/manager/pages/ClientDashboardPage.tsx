import { useParams } from "react-router-dom";
import { Card } from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { SortableTableHead } from "@/shared/components/ui/sortable-table-head";
import { useSummary } from "@/shared/hooks/useSummary";
import { useWealthHistory } from "@/shared/hooks/useWealthHistory";
import { AllocationByClass } from "@/shared/types/investment";
import {
  formatAdherence,
  formatCentsToCurrency,
  getAdherenceColor,
} from "@/shared/utils/formatters";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";
import { Button } from "@/shared/components/ui/button";
import { WealthEvolutionChart } from "@/shared/components/WealthEvolutionChart";
import { WealthHistoryFormDialog } from "@/shared/components/WealthHistoryFormDialog";
import { WealthHistoryList } from "@/shared/components/WealthHistoryList";
import { WealthHistory } from "@/shared/types/wealthHistory";
import { useState } from "react";
import { SummaryCards } from "@/features/summary/components/SummaryCards";
import { ManagerContextBanner } from "@/features/manager/components/ManagerContextBanner";

const COLORS = [
  "#A8D5BA",
  "#B4A7D6",
  "#A0C4FF",
  "#FFB4A2",
  "#E5B8F4",
  "#C5E1A5",
  "#FFCCB2",
  "#A8DADC",
  "#DDA0DD",
];

export const ClientDashboardPage = () => {
  const { investorId } = useParams<{ investorId: string }>();
  const id = Number(investorId);

  const { summary, isLoadingSummary, exchangeRate, adherence } = useSummary(id);
  const { wealthHistory, isLoading: isLoadingWealthHistory } =
    useWealthHistory(id);
  const { t, i18n } = useTranslation();
  const usdToBrlRate = exchangeRate?.usdToBrl ?? 5.7;

  const getClassLabel = (className: string) => {
    if (className === "stocks") return t("dashboard.assetClasses.stocks");
    if (className === "fiis") return t("dashboard.assetClasses.fiis");
    if (className === "fixed_income") {
      return t("dashboard.assetClasses.fixed_income");
    }
    return className;
  };

  const [isWealthHistoryDialogOpen, setIsWealthHistoryDialogOpen] =
    useState(false);
  const [editingWealthHistory, setEditingWealthHistory] =
    useState<WealthHistory | null>(null);

  const [classSort, setClassSort] = useState<{ key: string; order: "ASC" | "DESC" }>(
    { key: "actualPercentage", order: "DESC" },
  );
  const [typeSort, setTypeSort] = useState<{ key: string; order: "ASC" | "DESC" }>(
    { key: "actualPercentage", order: "DESC" },
  );

  const toggleClassSort = (key: string) => {
    setClassSort((prev) =>
      prev.key === key
        ? { key, order: prev.order === "ASC" ? "DESC" : "ASC" }
        : { key, order: "DESC" },
    );
  };

  const toggleTypeSort = (key: string) => {
    setTypeSort((prev) =>
      prev.key === key
        ? { key, order: prev.order === "ASC" ? "DESC" : "ASC" }
        : { key, order: "DESC" },
    );
  };

  const handleOpenDialog = () => {
    setEditingWealthHistory(null);
    setIsWealthHistoryDialogOpen(true);
  };

  const handleEditWealthHistory = (item: WealthHistory) => {
    setEditingWealthHistory(item);
    setIsWealthHistoryDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsWealthHistoryDialogOpen(false);
    setEditingWealthHistory(null);
  };

  // actualPercentage já vem convertido por câmbio do backend (getSummary
  // corrige a mistura de moedas antes de calcular o total) — não recalcula
  // mais aqui, só reaproveita.
  const summaryAllocation: AllocationByClass[] = summary
    ? summary.map((item) => ({
        class: item.assetClassName,
        type: item.assetTypeName,
        currency: item.currency,
        targetPercentage: item.targetPercentage,
        actualPercentage: item.actualPercentage,
        actualValue: item.totalValueCents,
      }))
    : [];

  // `summary` só traz tipos com posição atual (parte de Asset, não de
  // AssetType) — um tipo com meta mas zero posição fica de fora e faria o
  // "Desvio total" do header não bater com a soma das linhas da tabela.
  const typesWithData = new Set(
    summaryAllocation.map((item) => `${item.class}|${item.type}`),
  );
  const zeroPositionAllocation: AllocationByClass[] = (adherence?.byType ?? [])
    .filter(
      (t) => !typesWithData.has(`${t.assetClassName}|${t.assetTypeName}`),
    )
    .map((t) => ({
      class: t.assetClassName,
      type: t.assetTypeName,
      currency: "BRL",
      targetPercentage: t.targetPercentage,
      actualPercentage: 0,
      actualValue: 0,
    }));

  const allocationByClass = [...summaryAllocation, ...zeroPositionAllocation];

  const deviationByClass = new Map(
    (adherence?.byClass ?? []).map((c) => [c.assetClassName, c.deviationPp]),
  );
  const deviationByType = new Map(
    (adherence?.byType ?? []).map((t) => [
      `${t.assetClassName}|${t.assetTypeName}`,
      t.deviationPp,
    ]),
  );

  const classGroups = allocationByClass.reduce(
    (acc, item) => {
      const className = item.class;
      const valueBRL =
        item.currency === "USD"
          ? (item.actualValue ?? 0) * usdToBrlRate
          : (item.actualValue ?? 0);
      if (!acc[className]) {
        acc[className] = {
          actualPercentage: 0,
          targetPercentage: 0,
          actualValueBRL: 0,
          currencies: new Set<string>(),
          _seenTypes: new Set<string>(),
        };
      }
      acc[className].actualPercentage += item.actualPercentage ?? 0;
      acc[className].actualValueBRL += valueBRL;
      if (item.currency) acc[className].currencies.add(item.currency);
      const typeKey = `${className}|${item.type}`;
      if (!acc[className]._seenTypes.has(typeKey)) {
        acc[className].targetPercentage += item.targetPercentage ?? 0;
        acc[className]._seenTypes.add(typeKey);
      }
      return acc;
    },
    {} as Record<
      string,
      {
        actualPercentage: number;
        targetPercentage: number;
        actualValueBRL: number;
        currencies: Set<string>;
        _seenTypes: Set<string>;
      }
    >,
  );

  const sortedClassEntries = Object.entries(classGroups).sort(([aName, aData], [bName, bData]) => {
    let aVal: number | string;
    let bVal: number | string;
    switch (classSort.key) {
      case "class": aVal = aName; bVal = bName; break;
      case "value": aVal = aData.actualValueBRL; bVal = bData.actualValueBRL; break;
      case "targetPercentage": aVal = aData.targetPercentage; bVal = bData.targetPercentage; break;
      default: aVal = aData.actualPercentage; bVal = bData.actualPercentage;
    }
    if (typeof aVal === "string" && typeof bVal === "string") {
      return classSort.order === "ASC" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return classSort.order === "ASC" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  const sortedTypeRows = [...allocationByClass].sort((a, b) => {
    let aVal: number | string;
    let bVal: number | string;
    switch (typeSort.key) {
      case "class": aVal = a.class; bVal = b.class; break;
      case "type": aVal = a.type; bVal = b.type; break;
      case "value":
        aVal = a.currency === "USD" ? (a.actualValue ?? 0) * usdToBrlRate : (a.actualValue ?? 0);
        bVal = b.currency === "USD" ? (b.actualValue ?? 0) * usdToBrlRate : (b.actualValue ?? 0);
        break;
      case "targetPercentage": aVal = a.targetPercentage ?? 0; bVal = b.targetPercentage ?? 0; break;
      default: aVal = a.actualPercentage ?? 0; bVal = b.actualPercentage ?? 0;
    }
    if (typeof aVal === "string" && typeof bVal === "string") {
      return typeSort.order === "ASC" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return typeSort.order === "ASC" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
  });

  return (
    <div>
      <ManagerContextBanner investorId={id} />

      <div className="flex flex-col gap-3 h-auto min-h-[calc(100vh-61px-49px)] p-3 overflow-x-hidden">
        <SummaryCards investorId={id} />

        {isLoadingSummary ? (
          <div>{t("dashboard.loading")}</div>
        ) : !summary || summary.length === 0 ? (
          <div>{t("dashboard.table.empty")}</div>
        ) : (
        <>
        <h2 className="text-2xl font-semibold mb-2">{t("dashboard.title")}</h2>

        <Accordion type="single" collapsible defaultValue="table-class">
          <AccordionItem value="table-class" className="border rounded-lg mt-2">
            <AccordionTrigger className="px-4 hover:no-underline">
              <div className="flex items-center justify-between w-full pr-2">
                <span className="text-lg font-semibold">
                  {t("dashboard.sections.allocationByClass")}
                </span>
                {adherence && adherence.totalPp !== null && (
                  <span
                    className={`text-sm font-normal ${getAdherenceColor(adherence.totalPp)}`}
                  >
                    {t("dashboard.adherence.badge", {
                      value: adherence.totalPp.toFixed(2),
                    })}
                  </span>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <Card className="rounded-none border-t">
                <div className="overflow-x-auto">
                  <Table className="min-w-[480px]">
                    <TableHeader>
                      <TableRow>
                        <SortableTableHead
                          label={t("dashboard.table.headers.class")}
                          sortKey="actualPercentage"
                          currentSortBy={classSort.key}
                          currentOrder={classSort.order}
                          onSort={toggleClassSort}
                          className="w-full"
                        />
                        <SortableTableHead
                          label={t("dashboard.table.headers.value")}
                          sortKey="value"
                          currentSortBy={classSort.key}
                          currentOrder={classSort.order}
                          onSort={toggleClassSort}
                          className="text-right whitespace-nowrap"
                        />
                        <SortableTableHead
                          label={t("dashboard.table.headers.targetPercentage")}
                          sortKey="targetPercentage"
                          currentSortBy={classSort.key}
                          currentOrder={classSort.order}
                          onSort={toggleClassSort}
                          className="text-right whitespace-nowrap"
                        />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.keys(classGroups).length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                            {t("dashboard.table.empty")}
                          </TableCell>
                        </TableRow>
                      ) : (
                        sortedClassEntries.map(([className, data], index) => (
                          <TableRow key={className}>
                            <TableCell className="min-w-[240px] py-3">
                              <div className="space-y-2">
                                <span className="text-sm font-medium">
                                  {getClassLabel(className)}
                                </span>
                                <div className="flex items-center gap-2">
                                  <div className="relative flex-1 h-3.5 bg-muted rounded-full">
                                    <div
                                      className="h-full rounded-full"
                                      style={{
                                        width: `${Math.min(data.actualPercentage * 100, 100).toFixed(1)}%`,
                                        backgroundColor: COLORS[index % COLORS.length],
                                      }}
                                    />
                                    <div
                                      className="absolute top-[-3px] h-[calc(100%+6px)] w-[2px] rounded-full bg-foreground/40"
                                      style={{ left: `${Math.min(data.targetPercentage * 100, 100).toFixed(1)}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-medium text-muted-foreground w-10 text-right flex-shrink-0">
                                    {(data.actualPercentage * 100).toFixed(1)}%
                                  </span>
                                </div>
                                {deviationByClass.has(className) && (
                                  <span
                                    className={`text-xs ${getAdherenceColor(deviationByClass.get(className)!)}`}
                                  >
                                    {t("dashboard.adherence.rowDeviation", {
                                      value: deviationByClass.get(className)!.toFixed(1),
                                    })}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right text-sm whitespace-nowrap">
                              {(() => {
                                const displayCurrency =
                                  data.currencies.size === 1
                                    ? ([...data.currencies][0] as string)
                                    : "BRL";
                                const displayValue =
                                  displayCurrency === "USD"
                                    ? data.actualValueBRL / usdToBrlRate
                                    : data.actualValueBRL;
                                return formatCentsToCurrency(displayValue, displayCurrency);
                              })()}
                            </TableCell>
                            <TableCell className="text-right font-medium text-sm whitespace-nowrap">
                              {(data.targetPercentage * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="table" className="border rounded-lg mt-2">
            <AccordionTrigger className="px-4 hover:no-underline">
              <span className="text-lg font-semibold">
                {t("dashboard.sections.allocationByType")}
              </span>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <Card className="rounded-none border-t">
                <div className="overflow-x-auto">
                  <Table className="min-w-[480px]">
                    <TableHeader>
                      <TableRow>
                        <SortableTableHead
                          label={t("dashboard.table.headers.type")}
                          sortKey="actualPercentage"
                          currentSortBy={typeSort.key}
                          currentOrder={typeSort.order}
                          onSort={toggleTypeSort}
                          className="w-full"
                        />
                        <SortableTableHead
                          label={t("dashboard.table.headers.value")}
                          sortKey="value"
                          currentSortBy={typeSort.key}
                          currentOrder={typeSort.order}
                          onSort={toggleTypeSort}
                          className="text-right whitespace-nowrap"
                        />
                        <SortableTableHead
                          label={t("dashboard.table.headers.targetPercentage")}
                          sortKey="targetPercentage"
                          currentSortBy={typeSort.key}
                          currentOrder={typeSort.order}
                          onSort={toggleTypeSort}
                          className="text-right whitespace-nowrap"
                        />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allocationByClass.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                            {t("dashboard.table.empty")}
                          </TableCell>
                        </TableRow>
                      ) : (
                        sortedTypeRows.map((item, index) => (
                          <TableRow key={item.class + index}>
                            <TableCell className="min-w-[240px]">
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs text-muted-foreground">
                                    {getClassLabel(item.class)}
                                  </span>
                                  <span className="text-muted-foreground/40">·</span>
                                  <span className="text-sm font-medium">{item.type}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="relative flex-1 h-3.5 bg-muted rounded-full">
                                    <div
                                      className="h-full rounded-full"
                                      style={{
                                        width: `${Math.min(item.actualPercentage * 100, 100).toFixed(1)}%`,
                                        backgroundColor: COLORS[index % COLORS.length],
                                      }}
                                    />
                                    <div
                                      className="absolute top-[-3px] h-[calc(100%+6px)] w-[2px] rounded-full bg-foreground/40"
                                      style={{ left: `${Math.min(item.targetPercentage * 100, 100).toFixed(1)}%` }}
                                    />
                                  </div>
                                  <span className="text-xs font-medium text-muted-foreground w-10 text-right flex-shrink-0">
                                    {(item.actualPercentage * 100).toFixed(1)}%
                                  </span>
                                </div>
                                {deviationByType.has(`${item.class}|${item.type}`) && (
                                  <span
                                    className={`text-xs ${getAdherenceColor(deviationByType.get(`${item.class}|${item.type}`)!)}`}
                                  >
                                    {t("dashboard.adherence.rowDeviation", {
                                      value: deviationByType
                                        .get(`${item.class}|${item.type}`)!
                                        .toFixed(1),
                                    })}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-right text-sm whitespace-nowrap">
                              {formatCentsToCurrency(item.actualValue ?? 0, item.currency ?? "BRL")}
                            </TableCell>
                            <TableCell className="text-right font-medium text-sm whitespace-nowrap">
                              {(item.targetPercentage * 100).toFixed(1)}%
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="wealth-evolution" className="border rounded-lg mt-2">
            <AccordionTrigger className="px-4 hover:no-underline">
              <span className="text-lg font-semibold">
                {t("dashboard.sections.wealthEvolution")}
              </span>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <Card className="p-4 sm:p-6 rounded-none border-t">
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button size="sm" onClick={handleOpenDialog}>
                      {t("dashboard.wealthHistory.addHistory")}
                    </Button>
                  </div>
                  {isLoadingWealthHistory ? (
                    <p className="text-center text-muted-foreground">
                      {t("dashboard.wealthHistory.loading")}
                    </p>
                  ) : wealthHistory && wealthHistory.length > 0 ? (
                    <>
                      <WealthEvolutionChart wealthHistory={wealthHistory} />
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">
                          {t("dashboard.wealthHistory.recordsTitle")}
                        </h3>
                        <WealthHistoryList
                          wealthHistory={wealthHistory}
                          onEdit={handleEditWealthHistory}
                          investorId={id}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="text-center text-muted-foreground">
                      {t("dashboard.wealthHistory.empty")}
                    </p>
                  )}
                </div>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <WealthHistoryFormDialog
          item={editingWealthHistory}
          open={isWealthHistoryDialogOpen}
          onOpenChange={handleCloseDialog}
          investorId={id}
        />
        </>
        )}
      </div>
    </div>
  );
};
