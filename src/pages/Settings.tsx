import { Navbar } from "@/shared/components/Layout";
import { AssetClassTable } from "@/features/settings/components/AssetClassTable";
import { AssetTypesTable } from "@/features/settings/components/AssetTypesTable";
import { InstitutionsTable } from "@/features/settings/components/InstitutionsTable";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

export const Settings = () => {
  return (
    <div className="flex flex-col gap-3 h-[calc(100vh-61px)] p-3">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie suas classes e tipos de ativos
          </p>
        </div>

        <Tabs defaultValue="classes">
          <TabsList>
            <TabsTrigger value="classes">Classes de Ativos</TabsTrigger>
            <TabsTrigger value="types">Tipos de Ativos</TabsTrigger>
            <TabsTrigger value="institutions">Instituições</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
};
