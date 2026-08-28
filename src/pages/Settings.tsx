import { AssetClassTable } from "@/features/settings/components/AssetClassTable";
import { AssetTypesTable } from "@/features/settings/components/AssetTypesTable";
import { InstitutionsTable } from "@/features/settings/components/InstitutionsTable";
import { CryptoAccountsTable } from "@/features/settings/components/CryptoAccountsTable";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/shared/hooks/useAuth";

export const Settings = () => {
  const { t } = useTranslation();
  const { canOperateOwnPortfolio } = useAuth();

  return (
    <div className="flex flex-col gap-3 h-[calc(100vh-61px)] p-3">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{t("settings.title")}</h1>
          <p className="text-muted-foreground">{t("settings.subtitle")}</p>
          {!canOperateOwnPortfolio && (
            <p className="text-sm text-muted-foreground mt-2">
              {t("settings.autonomy.readOnlyNotice")}
            </p>
          )}
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
            <TabsTrigger value="cryptoAccounts">
              {t("settings.tabs.cryptoAccounts")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="classes">
            <div>
              <AssetClassTable />
            </div>
          </TabsContent>

          <TabsContent value="types">
            <div>
              <AssetTypesTable />
            </div>
          </TabsContent>

          <TabsContent value="institutions">
            <div>
              <InstitutionsTable />
            </div>
          </TabsContent>

          <TabsContent value="cryptoAccounts">
            <div>
              <CryptoAccountsTable />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
