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

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "#8b5cf6",
  "#f59e0b",
  "#10b981",
  "#06b6d4",
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
    <div className="flex flex-col gap-3 h-[calc(100vh-61px)] p-3">
      <h2 className="text-2xl font-semibold mb-4">{t("dashboard.title")}</h2>
      <Card className="flex-1 flex flex-col min-h-0">
        {/* <div className="grid md:grid-cols-2 gap-8"> */}
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>{t("dashboard.table.headers.class")}</TableHead>
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
                  colSpan={3}
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
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      {getClassLabel(item.class)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{item.type}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(item.actualValue)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {(item.actualPercentage * 100).toFixed(1)}%
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {(item.targetPercentage * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex items-center justify-center flex-col">
            <h3 className="text-lg font-semibold mb-4">Alocação Atual</h3>
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
                      `${name}: ${(value * 100).toFixed(1)}%`
                    }
                  >
                    {pieDataActual?.map((entry, index) => {
                      // Find the index in allocationByClass to get consistent color
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
              <p className="text-muted-foreground">Sem dados para exibir</p>
            )}
          </div>
          <div className="flex items-center justify-center flex-col">
            <h3 className="text-lg font-semibold mb-4">Alocação Meta</h3>
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
                      `${name}: ${(value * 100).toFixed(1)}%`
                    }
                  >
                    {pieDataTarget?.map((entry, index) => {
                      // Find the index in allocationByClass to get consistent color
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
              <p className="text-muted-foreground">Sem dados para exibir</p>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Comparação Atual vs Meta</h3>
        {barChartData && barChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                label={{ value: "%", angle: -90, position: "insideLeft" }}
              />
              <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              <Legend />
              <Bar dataKey="atual" fill="hsl(var(--chart-1))" name="Atual" />
              <Bar dataKey="meta" fill="hsl(var(--chart-2))" name="Meta" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground">Sem dados para exibir</p>
        )}
      </Card>
    </div>
  );
};
