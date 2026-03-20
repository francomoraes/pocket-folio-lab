import { Card } from "@/shared/components/ui/card";
import { formatCentsToCurrency } from "@/shared/utils/formatters";
import { useSummary } from "@/shared/hooks/useSummary";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import VariableIncome from "@/features/positions/components/VariableIncome/VariableIncome";
import FixedIncome from "@/features/positions/components/FixedIncome/FixedIncome";

export const Positions = () => {
  const { t } = useTranslation();
  const [consolidatedCurrency, setConsolidatedCurrency] = useState<
    "BRL" | "USD"
  >("BRL");

  const { summary, exchangeRate } = useSummary();

  const totalPatrimonyCents = summary?.reduce(
    (acc, item) => {
      const currency = item.currency;
      acc[currency] = (acc[currency] || 0) + item.totalValueCents;
      return acc;
    },
    {} as Record<string, number>,
  );

  const usdToBrlRate = exchangeRate?.usdToBrl || 5.7;

  const consolidatedPatrimonyBRL =
    (totalPatrimonyCents?.BRL || 0) +
    (totalPatrimonyCents?.USD || 0) * usdToBrlRate;

  const consolidatedPatrimonyUSD =
    consolidatedPatrimonyBRL / (usdToBrlRate || 5.7);

  return (
    <div className="flex flex-col gap-3 h-auto min-h-[calc(100vh-61px)] p-3">
      <Tabs defaultValue="positions" className="w-full">
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between items-start sm:items-center mb-4">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger className="flex-1 sm:flex-none" value="positions">
              {t("positions.tabs.variableIncome")}
            </TabsTrigger>
            <TabsTrigger className="flex-1 sm:flex-none" value="allocation">
              {t("positions.tabs.fixedIncome")}
            </TabsTrigger>
          </TabsList>

          <Card className="w-full sm:w-auto p-3 sm:p-4 flex-shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground flex gap-1 items-center mb-1">
                  {t("positions.summary.patrimonyUSD")}
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/555/555526.png"
                    width="16"
                    alt="USD"
                    className="inline"
                  />
                </p>
                <p className="text-lg sm:text-xl font-semibold truncate">
                  {formatCentsToCurrency(totalPatrimonyCents?.USD || 0, "USD")}
                </p>
              </div>
              <div>
                <p className="text-xs sm:text-sm text-muted-foreground flex gap-1 items-center mb-1">
                  {t("positions.summary.patrimonyBRL")}
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3022/3022546.png"
                    width="16"
                    alt="BRL"
                    className="inline"
                  />
                </p>
                <p className="text-lg sm:text-xl font-semibold truncate">
                  {formatCentsToCurrency(totalPatrimonyCents?.BRL || 0, "BRL")}
                </p>
              </div>
              <div className="sm:border-l sm:pl-6 col-span-1 sm:col-span-1 lg:col-span-1">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <p className="text-xs sm:text-sm text-muted-foreground font-semibold">
                    {t("positions.summary.patrimony")}
                  </p>
                  <div className="flex gap-1 bg-muted rounded p-1">
                    <button
                      onClick={() => setConsolidatedCurrency("BRL")}
                      className={`px-2 py-1 text-sm rounded transition ${
                        consolidatedCurrency === "BRL"
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title={t("positions.summary.currencyTitles.brl")}
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/3022/3022546.png"
                        width="16"
                        alt="BRL"
                        className="inline"
                      />
                    </button>
                    <button
                      onClick={() => setConsolidatedCurrency("USD")}
                      className={`px-2 py-1 text-sm rounded transition ${
                        consolidatedCurrency === "USD"
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title={t("positions.summary.currencyTitles.usd")}
                    >
                      <img
                        src="https://cdn-icons-png.flaticon.com/512/555/555526.png"
                        width="16"
                        alt="USD"
                        className="inline"
                      />
                    </button>
                  </div>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-primary truncate">
                  {formatCentsToCurrency(
                    consolidatedCurrency === "BRL"
                      ? consolidatedPatrimonyBRL
                      : consolidatedPatrimonyUSD,
                    consolidatedCurrency,
                  )}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <TabsContent value="positions" className="w-full">
          <VariableIncome />
        </TabsContent>
        <TabsContent value="allocation" className="w-full">
          <FixedIncome />
        </TabsContent>
      </Tabs>
    </div>
  );
};
