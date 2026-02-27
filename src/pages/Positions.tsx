import { Card } from "@/shared/components/ui/card";
import { formatCentsToCurrency } from "@/shared/utils/formatters";
import { useSummary } from "@/shared/hooks/useSummary";
import { useTranslation } from "react-i18next";
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

  return (
    <div className="flex flex-col gap-3 h-[calc(100vh-61px)] p-3">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold">{t("positions.title")}</h2>
          <p className="text-muted-foreground">{t("positions.subtitle")}</p>
        </div>
      </div>

      <Card className="p-3 flex-shrink-0">
        <div className="grid grid-cols-3 gap-8">
          <div>
            <p className="text-xs text-muted-foreground">
              {t("positions.summary.patrimonyUSD")}
            </p>
            <p className="text-xl font-semibold">
              {formatCentsToCurrency(totalPatrimonyCents?.USD || 0, "USD")}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("positions.summary.patrimonyBRL")}
            </p>
            <p className="text-xl font-semibold">
              {formatCentsToCurrency(totalPatrimonyCents?.BRL || 0, "BRL")}
            </p>
          </div>
          <div className="border-l pl-8">
            <p className="text-xs text-muted-foreground font-semibold">
              Patrimônio Consolidado
            </p>
            <p className="text-2xl font-bold text-primary">
              {formatCentsToCurrency(consolidatedPatrimonyBRL, "BRL")}
            </p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="positions" className="h-[calc(100%-142px)]">
        <TabsList>
          <TabsTrigger value="positions">Renda Variável</TabsTrigger>
          <TabsTrigger value="allocation">Renda fixa</TabsTrigger>
        </TabsList>

        <TabsContent value="positions" className="h-[calc(100%-48px)]">
          <VariableIncome />
        </TabsContent>
        <TabsContent value="allocation">
          <FixedIncome />
        </TabsContent>
      </Tabs>
    </div>
  );
};
