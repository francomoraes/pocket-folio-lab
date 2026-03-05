import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
} from "recharts";
import { WealthHistory } from "@/shared/types/wealthHistory";
import { useMemo, useState, useEffect } from "react";
import { Button } from "@/shared/components/ui/button";
import { wealthHistoryService } from "@/shared/services/wealthHistoryService";

interface WealthEvolutionChartProps {
  wealthHistory: WealthHistory[];
}

type Granularity = "monthly" | "quarterly" | "semiannual" | "annual";

type MarketIndexPoint = { date: string; value: number };

type MarketIndicesResponse = {
  cdi: MarketIndexPoint[];
  ipca: MarketIndexPoint[];
  sp500: MarketIndexPoint[];
};

const getPeriodKey = (date: Date, granularity: Granularity): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  if (granularity === "monthly") {
    return `${year}-${String(month).padStart(2, "0")}`;
  }

  if (granularity === "quarterly") {
    return `${year}-Q${Math.floor((month - 1) / 3) + 1}`;
  }

  if (granularity === "semiannual") {
    return `${year}-H${month <= 6 ? 1 : 2}`;
  }

  return `${year}`;
};

const buildNormalizedPriceSeries = (
  points: MarketIndexPoint[],
  periodOrder: string[],
  granularity: Granularity,
): Map<string, number> => {
  const byPeriod = new Map<string, { date: Date; value: number }>();

  points.forEach((point) => {
    const date = new Date(point.date);
    const key = getPeriodKey(date, granularity);
    const existing = byPeriod.get(key);

    if (!existing || date > existing.date) {
      byPeriod.set(key, { date, value: point.value });
    }
  });

  const result = new Map<string, number>();
  if (!periodOrder.length) return result;

  // A série sempre começa em 0% no primeiro ponto exibido do gráfico.
  result.set(periodOrder[0], 0);

  let base: number | null = null;
  let lastValue: number | null = null;

  periodOrder.slice(1).forEach((key) => {
    const current = byPeriod.get(key)?.value;

    if (current !== undefined) {
      if (base === null) base = current;
      if (base && base !== 0) {
        lastValue = Number(((current / base - 1) * 100).toFixed(2));
      }
    }

    if (lastValue !== null) {
      result.set(key, lastValue);
    }
  });

  return result;
};

const buildNormalizedRateSeries = (
  points: MarketIndexPoint[],
  periodOrder: string[],
  granularity: Granularity,
): Map<string, number> => {
  const periodFactors = new Map<string, number>();

  points.forEach((point) => {
    const date = new Date(point.date);
    const key = getPeriodKey(date, granularity);
    const currentFactor = periodFactors.get(key) ?? 1;
    periodFactors.set(key, currentFactor * (1 + point.value / 100));
  });

  const result = new Map<string, number>();
  if (!periodOrder.length) return result;

  // A série sempre começa em 0% no primeiro ponto exibido do gráfico.
  result.set(periodOrder[0], 0);

  let cumulative = 1;
  let hasAnyData = false;

  periodOrder.slice(1).forEach((key) => {
    const factor = periodFactors.get(key);

    if (factor !== undefined) {
      cumulative *= factor;
      hasAnyData = true;
    }

    if (hasAnyData) {
      result.set(key, Number(((cumulative - 1) * 100).toFixed(2)));
    } else {
      result.set(key, 0);
    }
  });

  return result;
};

const buildPortfolioPerformanceSeries = (
  chartData: Array<{ periodKey: string; value: number }>,
): Map<string, number> => {
  const result = new Map<string, number>();

  if (!chartData.length) return result;

  const base = chartData[0].value;
  if (!base) return result;

  chartData.forEach((point, index) => {
    if (index === 0) {
      result.set(point.periodKey, 0);
      return;
    }

    const pct = ((point.value / base - 1) * 100).toFixed(2);
    result.set(point.periodKey, Number(pct));
  });

  return result;
};

const formatChartData = (
  history: WealthHistory[],
  granularity: Granularity,
) => {
  if (!history || history.length === 0) return [];

  const getData = () => {
    switch (granularity) {
      case "monthly":
        return history.map((item) => ({
          date: new Date(item.date),
          value: item.totalWealthCents / 100,
          periodKey: getPeriodKey(new Date(item.date), granularity),
          label: new Date(item.date).toLocaleDateString("pt-BR", {
            year: "numeric",
            month: "short",
          }),
        }));

      case "quarterly": {
        const quarterly = new Map<string, (typeof history)[0]>();
        history.forEach((item) => {
          const date = new Date(item.date);
          const quarter = `${date.getFullYear()}-Q${Math.floor(date.getMonth() / 3) + 1}`;
          if (
            !quarterly.has(quarter) ||
            new Date(item.date) > new Date(quarterly.get(quarter)!.date)
          ) {
            quarterly.set(quarter, item);
          }
        });
        return Array.from(quarterly.values())
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          )
          .map((item) => ({
            date: new Date(item.date),
            value: item.totalWealthCents / 100,
            periodKey: getPeriodKey(new Date(item.date), granularity),
            label: (() => {
              const dateObj = new Date(item.date);
              const quarter = Math.floor(dateObj.getMonth() / 3) + 1;
              return `Q${quarter} ${dateObj.getFullYear()}`;
            })(),
          }));
      }

      case "semiannual": {
        const semiannual = new Map<string, (typeof history)[0]>();
        history.forEach((item) => {
          const date = new Date(item.date);
          const half = `${date.getFullYear()}-H${date.getMonth() < 6 ? 1 : 2}`;
          if (
            !semiannual.has(half) ||
            new Date(item.date) > new Date(semiannual.get(half)!.date)
          ) {
            semiannual.set(half, item);
          }
        });
        return Array.from(semiannual.values())
          .sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
          )
          .map((item) => ({
            date: new Date(item.date),
            value: item.totalWealthCents / 100,
            periodKey: getPeriodKey(new Date(item.date), granularity),
            label: (() => {
              const dateObj = new Date(item.date);
              const half = dateObj.getMonth() < 6 ? "H1" : "H2";
              return `${half} ${dateObj.getFullYear()}`;
            })(),
          }));
      }

      case "annual": {
        const annual = new Map<number, (typeof history)[0]>();
        history.forEach((item) => {
          const year = new Date(item.date).getFullYear();
          if (
            !annual.has(year) ||
            new Date(item.date) > new Date(annual.get(year)!.date)
          ) {
            annual.set(year, item);
          }
        });
        return Array.from(annual.values())
          .sort((a, b) => {
            const aYear = new Date(a.date).getFullYear();
            const bYear = new Date(b.date).getFullYear();
            return aYear - bYear;
          })
          .map((item) => ({
            date: new Date(item.date),
            value: item.totalWealthCents / 100,
            periodKey: getPeriodKey(new Date(item.date), granularity),
            label: new Date(item.date).getFullYear().toString(),
          }));
      }

      default:
        return [];
    }
  };

  return getData();
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const WealthEvolutionChart = ({
  wealthHistory,
}: WealthEvolutionChartProps) => {
  const [granularity, setGranularity] = useState<Granularity>("monthly");
  const [showIndices, setShowIndices] = useState({
    sp500: false,
    cdi: false,
    ipca: false,
  });
  const [indicesData, setIndicesData] = useState<MarketIndicesResponse | null>(
    null,
  );
  const [loadingIndices, setLoadingIndices] = useState(false);

  const sortedHistory = useMemo(
    () =>
      [...wealthHistory].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
    [wealthHistory],
  );

  const range = useMemo(() => {
    if (!sortedHistory.length) return null;
    return {
      startDate: sortedHistory[0].date,
      endDate: sortedHistory[sortedHistory.length - 1].date,
    };
  }, [sortedHistory]);

  const chartData = useMemo(
    () => formatChartData(sortedHistory, granularity),
    [sortedHistory, granularity],
  );

  // Fetch indices data when needed
  useEffect(() => {
    setIndicesData(null);
  }, [range?.startDate, range?.endDate]);

  useEffect(() => {
    const shouldFetchIndices =
      (showIndices.sp500 || showIndices.cdi || showIndices.ipca) && !!range;

    if (shouldFetchIndices && !indicesData && !loadingIndices) {
      setLoadingIndices(true);
      const startDate = range!.startDate;
      const endDate = range!.endDate;

      wealthHistoryService
        .getMarketIndicesHistory(startDate, endDate)
        .then((data) => {
          setIndicesData(data);
        })
        .catch((error) => {
          console.error("Error fetching indices:", error);
        })
        .finally(() => {
          setLoadingIndices(false);
        });
    }
  }, [showIndices, range, indicesData, loadingIndices]);

  // Merge indices data into chart data
  const enrichedChartData = useMemo(() => {
    if (!indicesData || chartData.length === 0) return chartData;

    const periodOrder = chartData.map((point) => point.periodKey);
    const sp500Series = buildNormalizedPriceSeries(
      indicesData.sp500,
      periodOrder,
      granularity,
    );
    const cdiSeries = buildNormalizedRateSeries(
      indicesData.cdi,
      periodOrder,
      granularity,
    );
    const ipcaSeries = buildNormalizedRateSeries(
      indicesData.ipca,
      periodOrder,
      granularity,
    );
    const portfolioSeries = buildPortfolioPerformanceSeries(chartData);

    return chartData.map((point) => {
      const enriched: Record<string, string | number | Date | null> = {
        ...point,
        portfolioPct: portfolioSeries.get(point.periodKey) ?? null,
      };

      if (showIndices.sp500) {
        enriched.sp500 = sp500Series.get(point.periodKey) ?? null;
      }

      if (showIndices.cdi) {
        enriched.cdi = cdiSeries.get(point.periodKey) ?? null;
      }

      if (showIndices.ipca) {
        enriched.ipca = ipcaSeries.get(point.periodKey) ?? null;
      }

      return enriched;
    });
  }, [chartData, indicesData, showIndices, granularity]);

  const hasAnyIndexSelected =
    showIndices.sp500 || showIndices.cdi || showIndices.ipca;

  const rightAxisTicks = [-20, 0, 20, 40, 60, 80, 100];

  if (!wealthHistory || wealthHistory.length === 0) {
    return (
      <div className="flex items-center justify-center h-80 text-muted-foreground">
        Nenhum histórico de patrimônio registrado
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 flex-wrap">
          {(
            ["monthly", "quarterly", "semiannual", "annual"] as Granularity[]
          ).map((gran) => (
            <Button
              key={gran}
              variant={granularity === gran ? "default" : "outline"}
              size="sm"
              onClick={() => setGranularity(gran)}
              className="text-xs sm:text-sm"
            >
              {gran === "monthly" && "Mensal"}
              {gran === "quarterly" && "Trimestral"}
              {gran === "semiannual" && "Semestral"}
              {gran === "annual" && "Anual"}
            </Button>
          ))}
        </div>

        <div className="flex gap-2 text-xs sm:text-sm">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showIndices.sp500}
              onChange={(e) =>
                setShowIndices({ ...showIndices, sp500: e.target.checked })
              }
              className="w-4 h-4"
            />
            S&P500
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showIndices.cdi}
              onChange={(e) =>
                setShowIndices({ ...showIndices, cdi: e.target.checked })
              }
              className="w-4 h-4"
            />
            CDI
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={showIndices.ipca}
              onChange={(e) =>
                setShowIndices({ ...showIndices, ipca: e.target.checked })
              }
              className="w-4 h-4"
            />
            IPCA
          </label>
        </div>
      </div>

      {enrichedChartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={enrichedChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              angle={-45}
              textAnchor="end"
              height={60}
              tick={{ fontSize: 12 }}
            />
            <YAxis
              yAxisId="left"
              label={{
                value: "Patrimônio (R$)",
                angle: -90,
                position: "insideLeft",
              }}
              tickFormatter={formatCurrency}
            />
            {hasAnyIndexSelected && (
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value: number) => `${value.toFixed(0)}%`}
                domain={[-20, 100]}
                ticks={rightAxisTicks}
                label={{
                  value: "Performance (% acumulada)",
                  angle: 90,
                  position: "insideRight",
                }}
              />
            )}
            <Tooltip
              formatter={(value: number, name: string) => {
                if (name === "Patrimônio") {
                  return [formatCurrency(value), name];
                }
                return [`${(value as number).toFixed(2)}%`, name];
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="value"
              fill="#A8D5BA"
              name="Patrimônio (R$)"
              radius={[8, 8, 0, 0]}
            />
            {hasAnyIndexSelected && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="portfolioPct"
                stroke="#0f172a"
                name="Carteira (%)"
                dot={false}
                strokeWidth={2}
                strokeDasharray="5 5"
                isAnimationActive={false}
              />
            )}
            {showIndices.sp500 && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="sp500"
                stroke="#ff7300"
                name="S&P500"
                dot={false}
                strokeWidth={2}
                isAnimationActive={false}
              />
            )}
            {showIndices.cdi && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="cdi"
                stroke="#8884d8"
                name="CDI"
                dot={false}
                strokeWidth={2}
                isAnimationActive={false}
              />
            )}
            {showIndices.ipca && (
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="ipca"
                stroke="#82ca9d"
                name="IPCA"
                dot={false}
                strokeWidth={2}
                isAnimationActive={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-center text-muted-foreground">
          Dados insuficientes para gerar gráfico
        </p>
      )}
    </div>
  );
};
