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
import { formatCentsToCurrency } from "@/shared/utils/formatters";
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
import { useState, useCallback } from "react";
import { SummaryCards } from "@/features/summary/components/SummaryCards";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

const ACCORDION_SECTIONS = [
  { id: "table-class" },
  { id: "table" },
  { id: "wealth-evolution" },
] as const;

type SectionId = (typeof ACCORDION_SECTIONS)[number]["id"];

const STORAGE_KEY = "dashboard-accordion-order";

const loadOrder = (): SectionId[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const parsed: SectionId[] = JSON.parse(stored);
    const defaultIds = ACCORDION_SECTIONS.map((s) => s.id);
    if (
      parsed.length === defaultIds.length &&
      defaultIds.every((id) => parsed.includes(id))
    ) {
      return parsed;
    }
  }
  return ACCORDION_SECTIONS.map((s) => s.id);
};

interface SortableAccordionItemProps {
  id: SectionId;
  children: React.ReactNode;
  dragAriaLabel: string;
}

const SortableAccordionItem = ({
  id,
  children,
  dragAriaLabel,
}: SortableAccordionItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-3 top-0 h-16 flex items-center cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground z-10"
        aria-label={dragAriaLabel}
      >
        <GripVertical size={16} />
      </div>
      {children}
    </div>
  );
};

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

export const Dashboard = () => {
  const { summary, isLoadingSummary, exchangeRate } = useSummary();
  const { wealthHistory, isLoading: isLoadingWealthHistory } =
    useWealthHistory();
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage || "pt-BR";
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
  const [sectionOrder, setSectionOrder] = useState<SectionId[]>(loadOrder);

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

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSectionOrder((prev) => {
        const oldIndex = prev.indexOf(active.id as SectionId);
        const newIndex = prev.indexOf(over.id as SectionId);
        const next = arrayMove(prev, oldIndex, newIndex);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    }
  }, []);

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

  const rawAllocItems = summary
    ? summary.map((item) => ({
        class: item.assetClassName,
        type: item.assetTypeName,
        currency: item.currency,
        targetPercentage: item.targetPercentage,
        actualValue: item.totalValueCents,
      }))
    : [];

  const totalBRL = rawAllocItems.reduce((acc, item) => {
    const valueBRL =
      item.currency === "USD"
        ? item.actualValue * usdToBrlRate
        : item.actualValue;
    return acc + valueBRL;
  }, 0);

  const allocationByClass: AllocationByClass[] = rawAllocItems.map((item) => {
    const valueBRL =
      item.currency === "USD"
        ? item.actualValue * usdToBrlRate
        : item.actualValue;
    return {
      ...item,
      actualPercentage: totalBRL > 0 ? valueBRL / totalBRL : 0,
    };
  });

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
      // targetPercentage is a property of the type, not per-currency row —
      // only add it once per unique type to avoid double-counting when the
      // same type has assets in multiple currencies (e.g. BTC in BRL + USD).
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
    <div className="flex flex-col gap-3 h-auto min-h-[calc(100vh-61px)] p-3 overflow-x-hidden">
      <SummaryCards />

      {isLoadingSummary ? (
        <div>{t("dashboard.loading")}</div>
      ) : !summary || summary.length === 0 ? (
        <div>{t("dashboard.table.empty")}</div>
      ) : (
      <>
      <h2 className="text-2xl font-semibold mb-2">{t("dashboard.title")}</h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sectionOrder}
          strategy={verticalListSortingStrategy}
        >
          <Accordion type="single" collapsible defaultValue="table-class">
            {sectionOrder.map((sectionId) => {
              if (sectionId === "table-class")
                return (
                  <SortableAccordionItem
                    key="table-class"
                    id="table-class"
                    dragAriaLabel={t("dashboard.dragToReorder")}
                  >
                    <AccordionItem
                      value="table-class"
                      className="border rounded-lg mt-2"
                    >
                      <AccordionTrigger className="pl-10 pr-4 hover:no-underline">
                        <span className="text-lg font-semibold">
                          {t("dashboard.sections.allocationByClass")}
                        </span>
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
                                    <TableCell
                                      colSpan={3}
                                      className="text-center text-muted-foreground py-8"
                                    >
                                      {t("dashboard.table.empty")}
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  sortedClassEntries.map(
                                    ([className, data], index) => (
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
                                    ),
                                  )
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </Card>
                      </AccordionContent>
                    </AccordionItem>
                  </SortableAccordionItem>
                );

              if (sectionId === "table")
                return (
                  <SortableAccordionItem
                    key="table"
                    id="table"
                    dragAriaLabel={t("dashboard.dragToReorder")}
                  >
                    <AccordionItem
                      value="table"
                      className="border rounded-lg mt-2"
                    >
                      <AccordionTrigger className="pl-10 pr-4 hover:no-underline">
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
                                    <TableCell
                                      colSpan={3}
                                      className="text-center text-muted-foreground py-8"
                                    >
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
                                        </div>
                                      </TableCell>
                                      <TableCell className="text-right text-sm whitespace-nowrap">
                                        {formatCentsToCurrency(
                                          item.actualValue ?? 0,
                                          item.currency ?? "BRL",
                                        )}
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
                  </SortableAccordionItem>
                );

              if (sectionId === "wealth-evolution")
                return (
                  <SortableAccordionItem
                    key="wealth-evolution"
                    id="wealth-evolution"
                    dragAriaLabel={t("dashboard.dragToReorder")}
                  >
                    <AccordionItem
                      value="wealth-evolution"
                      className="border rounded-lg mt-2"
                    >
                      <AccordionTrigger className="pl-10 pr-4 hover:no-underline">
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
                                <WealthEvolutionChart
                                  wealthHistory={wealthHistory}
                                />
                                <div className="mt-6">
                                  <h3 className="text-lg font-semibold mb-4">
                                    {t("dashboard.wealthHistory.recordsTitle")}
                                  </h3>
                                  <WealthHistoryList
                                    wealthHistory={wealthHistory}
                                    onEdit={handleEditWealthHistory}
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
                  </SortableAccordionItem>
                );

              return null;
            })}
          </Accordion>
        </SortableContext>
      </DndContext>

      <WealthHistoryFormDialog
        item={editingWealthHistory}
        open={isWealthHistoryDialogOpen}
        onOpenChange={handleCloseDialog}
      />
      </>
      )}
    </div>
  );
};
