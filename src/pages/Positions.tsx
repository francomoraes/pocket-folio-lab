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

  return (
    <div className="flex flex-col gap-3 h-[calc(100vh-61px)] p-3 overflow-hidden">
      <Tabs defaultValue="positions" className="w-full flex flex-col flex-1 min-h-0">
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between items-start sm:items-center mb-4 shrink-0">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger className="flex-1 sm:flex-none" value="positions">
              {t("positions.tabs.variableIncome")}
            </TabsTrigger>
            <TabsTrigger className="flex-1 sm:flex-none" value="allocation">
              {t("positions.tabs.fixedIncome")}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="positions" className="w-full flex flex-col flex-1 min-h-0 mt-0">
          <VariableIncome />
        </TabsContent>
        <TabsContent value="allocation" className="w-full flex flex-col flex-1 min-h-0 mt-0">
          <FixedIncome />
        </TabsContent>
      </Tabs>
    </div>
  );
};
