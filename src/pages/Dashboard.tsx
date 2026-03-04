import { Card } from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { useSummary } from "@/shared/hooks/useSummary";
import { AllocationByClass } from "@/shared/types/investment";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
} from "recharts";
import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/shared/components/ui/accordion";

// Cores pastel profissionais
const COLORS = [
  "#A8D5BA", // Verde pastel
  "#B4A7D6", // Roxo pastel
  "#A0C4FF", // Azul pastel
  "#FFB4A2", // Rosa/Coral pastel
  "#E5B8F4", // Magenta pastel
  "#C5E1A5", // Lima pastel
  "#FFCCB2", // Pêssego pastel
  "#A8DADC", // Cyan pastel
  "#DDA0DD", // Plum pastel
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const getClassLabel = (className: string) => {
  const labels: Record<string, string> = {
    stocks: "Ações",
    fiis: "FIIs",
    fixed_income: "Renda Fixa",
  };
  return labels[className] || className;
};

export const Dashboard = () => {
  const { summary, isLoadingSummary } = useSummary();
  const { t } = useTranslation();

  const allocationByClass: AllocationByClass[] = summary
    ? summary?.map((item) => ({
        class: item.assetClassName,
        type: item.assetTypeName,
        actualPercentage: item.actualPercentage,
        targetPercentage: item.targetPercentage,
        actualValue: item.totalValueCents,
        targetValue:
          (item.targetPercentage * item.totalValueCents) /
          item.actualPercentage,
      }))
    : [];

  // Group by class for pie charts
  const classGroups = allocationByClass.reduce(
    (acc, item) => {
      const className = item.class;
      if (!acc[className]) {
        acc[className] = {
          actualPercentage: 0,
          targetPercentage: 0,
        };
      }
      acc[className].actualPercentage += item.actualPercentage;
      acc[className].targetPercentage += item.targetPercentage;
      return acc;
    },
    {} as Record<
      string,
      { actualPercentage: number; targetPercentage: number }
    >,
  );

  const pieDataActual = Object.entries(classGroups).map(
    ([className, data]) => ({
      name: getClassLabel(className),
      value: data.actualPercentage,
      className: className,
    }),
  );

  const pieDataTarget = Object.entries(classGroups).map(
    ([className, data]) => ({
      name: getClassLabel(className),
      value: data.targetPercentage,
      className: className,
    }),
  );

  const barChartData = Object.entries(classGroups).map(([className, data]) => ({
    name: getClassLabel(className),
    atual: data.actualPercentage * 100,
    meta: data.targetPercentage * 100,
  }));

  if (isLoadingSummary) {
    return <div>{t("dashboard.loading")}</div>;
  }

  if (!summary || summary.length === 0) {
    return <div>{t("dashboard.table.empty")}</div>;
  }

  return (
    <div className="flex flex-col gap-3 h-auto min-h-[calc(100vh-61px)] p-3">
      <h2 className="text-2xl font-semibold mb-2">{t("dashboard.title")}</h2>

      <Accordion
        type="single"
        collapsible
        defaultValue="table"
        className="w-full"
      >
        {/* Tabela */}
        <AccordionItem value="table" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className="text-lg font-semibold">
              {t("dashboard.table.headers.class")}
            </span>
          </AccordionTrigger>
          <AccordionContent className="p-0">
            <Card className="rounded-none border-t">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>
                        {t("dashboard.table.headers.class")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("dashboard.table.headers.type")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("dashboard.table.headers.value")}
                      </TableHead>
                      <TableHead className="text-right">% Atual</TableHead>
                      <TableHead className="text-right">% Meta</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allocationByClass.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={5}
                          className="text-center text-muted-foreground py-8"
                        >
                          {t("dashboard.table.empty")}
                        </TableCell>
                      </TableRow>
                    ) : (
                      allocationByClass?.map((item, index) => (
                        <TableRow key={item.class + index}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{
                                  backgroundColor:
                                    COLORS[index % COLORS.length],
                                }}
                              />
                              <span className="hidden sm:inline">
                                {getClassLabel(item.class)}
                              </span>
                              <span className="sm:hidden text-xs">
                                {getClassLabel(item.class).substring(0, 3)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-sm sm:text-base">
                            {item.type}
                          </TableCell>
                          <TableCell className="text-right text-sm sm:text-base">
                            {formatCurrency(item.actualValue)}
                          </TableCell>
                          <TableCell className="text-right font-medium text-sm sm:text-base">
                            {(item.actualPercentage * 100).toFixed(1)}%
                          </TableCell>
                          <TableCell className="text-right font-medium text-sm sm:text-base">
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

        {/* Gráficos de Pizza */}
        <AccordionItem value="pie" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className="text-lg font-semibold">Gráficos de Alocação</span>
          </AccordionTrigger>
          <AccordionContent className="p-0">
            <Card className="p-4 sm:p-6 rounded-none border-t">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-base sm:text-lg font-semibold mb-4">
                    Alocação Atual
                  </h3>
                  {pieDataActual && pieDataActual.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieDataActual}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value }) =>
                            `${name}: ${(value * 100).toFixed(0)}%`
                          }
                        >
                          {pieDataActual?.map((entry, index) => {
                            const colorIndex = allocationByClass.findIndex(
                              (item) => item.class === entry.className,
                            );
                            return (
                              <Cell
                                key={`cell-actual-${entry.className}`}
                                fill={COLORS[colorIndex % COLORS.length]}
                              />
                            );
                          })}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) =>
                            `${(value * 100).toFixed(1)}%`
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground">
                      Sem dados para exibir
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-center justify-center">
                  <h3 className="text-base sm:text-lg font-semibold mb-4">
                    Alocação Meta
                  </h3>
                  {pieDataTarget && pieDataTarget.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieDataTarget}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, value }) =>
                            `${name}: ${(value * 100).toFixed(0)}%`
                          }
                        >
                          {pieDataTarget?.map((entry, index) => {
                            const colorIndex = allocationByClass.findIndex(
                              (item) => item.class === entry.className,
                            );
                            return (
                              <Cell
                                key={`cell-target-${entry.className}`}
                                fill={COLORS[colorIndex % COLORS.length]}
                              />
                            );
                          })}
                        </Pie>
                        <Tooltip
                          formatter={(value: number) =>
                            `${(value * 100).toFixed(1)}%`
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-muted-foreground">
                      Sem dados para exibir
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </AccordionContent>
        </AccordionItem>

        {/* Gráfico de Barras */}
        <AccordionItem value="bar" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <span className="text-lg font-semibold">
              Comparação Atual vs Meta
            </span>
          </AccordionTrigger>
          <AccordionContent className="p-0">
            <Card className="p-4 sm:p-6 rounded-none border-t">
              {barChartData && barChartData.length > 0 ? (
                <div className="w-full overflow-x-auto">
                  <ResponsiveContainer width="100%" height={300} minWidth={300}>
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis
                        label={{
                          value: "%",
                          angle: -90,
                          position: "insideLeft",
                        }}
                      />
                      <Tooltip
                        formatter={(value: number) => `${value.toFixed(1)}%`}
                      />
                      <Legend />
                      <Bar
                        dataKey="atual"
                        fill={COLORS[0]}
                        name="Atual"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar
                        dataKey="meta"
                        fill={COLORS[1]}
                        name="Meta"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-muted-foreground">Sem dados para exibir</p>
              )}
            </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
