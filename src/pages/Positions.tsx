import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import VariableIncome from "@/features/positions/components/VariableIncome/VariableIncome";
import FixedIncome from "@/features/positions/components/FixedIncome/FixedIncome";
import { AssetTransactionHistory } from "@/features/positions/components";

export const Positions = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "positions";

  const handleTabChange = (value: string) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", value);
    if (value !== "transactions") {
      next.delete("assetId");
    }
    setSearchParams(next);
  };

  return (
    <div className="flex flex-col gap-3 h-[calc(100vh-61px)] p-3 overflow-hidden">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-full flex flex-col flex-1 min-h-0"
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between items-start sm:items-center mb-4 shrink-0">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger className="flex-1 sm:flex-none" value="positions">
              {t("positions.tabs.variableIncome")}
            </TabsTrigger>
            <TabsTrigger className="flex-1 sm:flex-none" value="allocation">
              {t("positions.tabs.fixedIncome")}
            </TabsTrigger>
            <TabsTrigger className="flex-1 sm:flex-none" value="transactions">
              {t("positions.tabs.transactions")}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="positions" className="w-full flex flex-col flex-1 min-h-0 mt-0">
          <VariableIncome />
        </TabsContent>
        <TabsContent value="allocation" className="w-full flex flex-col flex-1 min-h-0 mt-0">
          <FixedIncome />
        </TabsContent>
        <TabsContent value="transactions" className="w-full flex flex-col flex-1 min-h-0 mt-0">
          <AssetTransactionHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
};
