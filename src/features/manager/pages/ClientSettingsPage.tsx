import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ManagerContextBanner } from "@/features/manager/components/ManagerContextBanner";
import { AssetClassTable } from "@/features/settings/components/AssetClassTable";
import { AssetTypesTable } from "@/features/settings/components/AssetTypesTable";
import { InstitutionsTable } from "@/features/settings/components/InstitutionsTable";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

export const ClientSettingsPage = () => {
  const { investorId } = useParams<{ investorId: string }>();
  const id = Number(investorId);
  const { t } = useTranslation();

  return (
    <div>
      <ManagerContextBanner investorId={id} />

      <div className="flex flex-col gap-3 p-3">
        <div>
          <h1 className="text-3xl font-bold">
            {t("clients.settings.title", "Configurações")}
          </h1>
        </div>

        <Tabs defaultValue="classes">
          <TabsList>
            <TabsTrigger value="classes">
              {t("settings.tabs.assetClasses")}
            </TabsTrigger>
            <TabsTrigger value="types">
              {t("settings.tabs.assetTypes")}
            </TabsTrigger>
            <TabsTrigger value="institutions">
              {t("settings.tabs.institutions")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classes">
            <AssetClassTable investorId={id} />
          </TabsContent>

          <TabsContent value="types">
            <AssetTypesTable investorId={id} />
          </TabsContent>

          <TabsContent value="institutions">
            <InstitutionsTable investorId={id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
