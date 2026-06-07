import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { managerService } from "@/features/manager/services/managerService";
import { ManagerContextBanner } from "@/features/manager/components/ManagerContextBanner";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Card } from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { formatCentsToCurrency, formatQuantity } from "@/shared/utils/formatters";
import { useTranslation } from "react-i18next";
import CircularProgress from "@/shared/components/ui/circular-progress";

export const ClientPositionsPage = () => {
  const { investorId } = useParams<{ investorId: string }>();
  const id = Number(investorId);
  const { t } = useTranslation();

  const { data: assetsData, isLoading: isLoadingAssets } = useQuery({
    queryKey: QUERY_KEYS.clientAssets(id),
    queryFn: () => managerService.getClientAssets(id, { page: 1, itemsPerPage: 100 }),
    enabled: !!id,
    staleTime: 60 * 1000,
  });

  const { data: fixedIncomeData, isLoading: isLoadingFixed } = useQuery({
    queryKey: QUERY_KEYS.clientFixedIncome(id),
    queryFn: () =>
      managerService.getClientFixedIncomeAssets(id, { page: 1, itemsPerPage: 100 }),
    enabled: !!id,
    staleTime: 60 * 1000,
  });

  const assets = assetsData?.data ?? [];
  const fixedIncome = fixedIncomeData?.data ?? [];

  return (
    <div>
      <ManagerContextBanner investorId={id} />

      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-xl font-semibold">{t("positions.title", "Posições")}</h1>

        <Tabs defaultValue="variable">
          <TabsList>
            <TabsTrigger value="variable">
              {t("positions.tabs.variableIncome")}
            </TabsTrigger>
            <TabsTrigger value="fixed">
              {t("positions.tabs.fixedIncome")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="variable">
            {isLoadingAssets ? (
              <CircularProgress />
            ) : assets.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">
                {t("positions.table.empty", "Nenhum ativo encontrado")}
              </p>
            ) : (
              <Card>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("positions.table.headers.ticker")}</TableHead>
                        <TableHead>{t("positions.table.headers.institution")}</TableHead>
                        <TableHead className="text-right">
                          {t("positions.table.headers.quantity")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("positions.table.headers.currentPrice")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("positions.table.headers.totalValue")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {assets.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell className="font-medium">
                            {asset.ticker}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {asset.institution?.name ?? "—"}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {formatQuantity(asset.quantity)}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {formatCentsToCurrency(
                              asset.currentPriceCents,
                              asset.currency,
                            )}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {formatCentsToCurrency(
                              asset.currentValueCents,
                              asset.currency,
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="fixed">
            {isLoadingFixed ? (
              <CircularProgress />
            ) : fixedIncome.length === 0 ? (
              <p className="text-muted-foreground text-sm py-4">
                {t("positions.table.empty", "Nenhum ativo encontrado")}
              </p>
            ) : (
              <Card>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("positions.table.headers.name", "Nome")}</TableHead>
                        <TableHead>{t("positions.table.headers.institution")}</TableHead>
                        <TableHead className="text-right">
                          {t("positions.table.headers.investedAmount", "Investido")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("positions.table.headers.currentValue", "Valor atual")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fixedIncome.map((asset) => (
                        <TableRow key={asset.id}>
                          <TableCell className="font-medium">
                            {asset.description}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {asset.institution?.name ?? "—"}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {formatCentsToCurrency(
                              asset.investedValueCents,
                              "BRL",
                            )}
                          </TableCell>
                          <TableCell className="text-right text-sm">
                            {formatCentsToCurrency(
                              asset.currentValueCents,
                              "BRL",
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
