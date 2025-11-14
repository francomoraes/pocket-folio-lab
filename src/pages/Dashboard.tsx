import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePositions } from "@/hooks/usePositions";
import { useSummary } from "@/hooks/useSummary";
import { AllocationByClass, AllocationByTicker } from "@/types/investment";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  Rectangle,
} from "recharts";

interface DashboardProps {
  allocationByClass: AllocationByClass[];
  allocationByTicker: AllocationByTicker[];
  patrimonyEvolution: Array<{ date: string; value: number }>;
}

const COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
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
  const {
    summary,
    isLoadingSummary,
    errorSummary,
    refetchSummary,

    overview,
    isLoadingOverview,
    errorOverview,
    refetchOverview,
  } = useSummary();

  const { assets, isLoading } = usePositions();

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

  const classSummaryBarChartData = allocationByClass?.map((item) => ({
    name: getClassLabel(item.class),
    actualValue: item.actualValue,
    targetValue: item.targetValue,
    actualPercentage: item.actualPercentage * 100,
    targetPercentage: item.targetPercentage * 100,
  }));

  const pieDataActual = summary?.map((item) => ({
    name: getClassLabel(item.assetClassName),
    value: item.actualPercentage,
  }));

  const pieDataTarget = summary?.map((item) => ({
    name: getClassLabel(item.assetClassName),
    value: item.targetPercentage,
  }));

  const allocationByTicker: AllocationByTicker[] = assets
    ? assets?.map((asset) => ({
        ticker: asset.ticker,
        percentage: asset?.portfolioPercentage * 100,
        value: (asset.quantity * asset.averagePriceCents) / 100,
      }))
    : [];

  const barData = allocationByTicker?.map((item) => ({
    ticker: item.ticker,
    percentage: item.percentage,
    value: item.value,
  }));

  const totalPatrimony = overview
    ? overview.reduce((sum, item) => sum + item.totalCents / 100, 0)
    : 0;

  if (isLoadingSummary) {
    return <div>Carregando dashboard...</div>;
  }

  if (!summary || summary.length === 0) {
    return <div>Nenhum dado disponível</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Alocação por Classe</h2>
        <Card className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Classe</TableHead>
                    <TableHead className="text-right">Tipo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">%</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allocationByClass.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center text-muted-foreground py-8"
                      >
                        Nenhum dado disponível
                      </TableCell>
                    </TableRow>
                  ) : (
                    allocationByClass?.map((item, index) => (
                      <TableRow key={item.class}>
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
                        <TableCell className="text-right">
                          {item.type}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.actualValue)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {item.actualPercentage.toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-center">
              {classSummaryBarChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={classSummaryBarChartData}
                    margin={{
                      top: 5,
                      right: 0,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="actualPercentage"
                      fill="hsl(var(--chart-1))"
                    />
                    <Bar
                      dataKey="targetPercentage"
                      fill="hsl(var(--chart-2))"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground">Sem dados para exibir</p>
              )}
            </div>
          </div>
        </Card>
      </div>
      <div>
        <h2 className="text-2xl font-semibold mb-4">Alocação por Classe</h2>
        <Card className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex items-center justify-center flex-col">
              <h5>Actual Percentage Allocation</h5>
              {pieDataActual.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart
                    margin={{
                      top: 5,
                      right: 0,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <Pie
                      data={pieDataActual}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieDataActual?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground">Sem dados para exibir</p>
              )}
            </div>
            <div className="flex items-center justify-center flex-col">
              <h5>Actual Percentage Allocation</h5>
              {pieDataTarget.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart
                    margin={{
                      top: 5,
                      right: 0,
                      left: 0,
                      bottom: 5,
                    }}
                  >
                    <Pie
                      data={pieDataTarget}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {pieDataTarget?.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground">Sem dados para exibir</p>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
