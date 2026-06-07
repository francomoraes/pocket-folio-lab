import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { managerService } from "@/features/manager/services/managerService";
import { ManagerContextBanner } from "@/features/manager/components/ManagerContextBanner";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { Card } from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";
import CircularProgress from "@/shared/components/ui/circular-progress";
import { useState } from "react";
import { ClientAssetTypeTarget } from "@/shared/types/manager";
import { SummaryData } from "@/shared/types/summary";
import { formatCentsToCurrency } from "@/shared/utils/formatters";

export const ClientTargetsPage = () => {
  const { investorId } = useParams<{ investorId: string }>();
  const id = Number(investorId);
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [editValues, setEditValues] = useState<Record<number, string>>({});
  const [savingId, setSavingId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: QUERY_KEYS.clientProfile(id),
    queryFn: () => managerService.getClientProfile(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });

  const { data: summaryResponse } = useQuery({
    queryKey: QUERY_KEYS.clientSummary(id),
    queryFn: () => managerService.getClientSummary(id),
    enabled: !!id,
    staleTime: 60 * 1000,
  });

  const summaryMap: Record<string, SummaryData> = Object.fromEntries(
    (summaryResponse?.data ?? []).map((item: SummaryData) => [
      item.assetTypeName,
      item,
    ]),
  );

  const saveMutation = useMutation({
    mutationFn: ({
      assetTypeId,
      targetPercentage,
    }: {
      assetTypeId: number;
      targetPercentage: number;
    }) =>
      managerService.updateClientAssetTypeTargetPercentage(
        id,
        assetTypeId,
        targetPercentage,
      ),
    onSuccess: (_, { assetTypeId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.clientProfile(id) });
      setEditValues((prev) => {
        const next = { ...prev };
        delete next[assetTypeId];
        return next;
      });
      toast.success(t("common.status.success", "Salvo com sucesso"));
    },
    onError: (error) => {
      toast.error(resolveErrorMessage(error, "common.status.error"));
    },
  });

  const assetTypes: ClientAssetTypeTarget[] = data?.assetTypes ?? [];

  const getDisplayValue = (assetType: ClientAssetTypeTarget) => {
    if (editValues[assetType.assetTypeId] !== undefined) {
      return editValues[assetType.assetTypeId];
    }
    return (assetType.targetPercentage * 100).toFixed(1);
  };

  const handleSave = async (assetTypeId: number) => {
    const raw = editValues[assetTypeId];
    if (raw === undefined) return;
    const parsed = parseFloat(raw);
    if (isNaN(parsed) || parsed < 0 || parsed > 100) {
      toast.error("Valor deve ser entre 0 e 100");
      return;
    }
    setSavingId(assetTypeId);
    try {
      await saveMutation.mutateAsync({
        assetTypeId,
        targetPercentage: parsed / 100,
      });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div>
      <ManagerContextBanner investorId={id} />

      <div className="flex flex-col gap-4 p-4">
        <h1 className="text-xl font-semibold">
          {t("managerContext.nav.targets")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t(
            "clients.targets.description",
            "Edite os percentuais meta de cada tipo de ativo deste investidor.",
          )}
        </p>

        {isLoading ? (
          <CircularProgress />
        ) : assetTypes.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {t("common.status.noData")}
          </p>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("dashboard.table.headers.type")}</TableHead>
                  <TableHead className="text-right">
                    {t("dashboard.table.headers.value")}
                  </TableHead>
                  <TableHead className="w-[100px]">
                    {t("dashboard.table.headers.actualPercentage")}
                  </TableHead>
                  <TableHead className="w-[160px]">
                    {t("dashboard.table.headers.targetPercentage")}
                  </TableHead>
                  <TableHead className="w-[80px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {assetTypes.map((assetType) => {
                  const isDirty =
                    editValues[assetType.assetTypeId] !== undefined;
                  const isSaving = savingId === assetType.assetTypeId;
                  const summaryItem = summaryMap[assetType.assetTypeName];

                  return (
                    <TableRow key={assetType.assetTypeId}>
                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {assetType.assetClassName}
                        </span>
                        {" · "}
                        <span className="font-medium">{assetType.assetTypeName}</span>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {summaryItem
                          ? formatCentsToCurrency(summaryItem.totalValueCents, summaryItem.currency)
                          : "—"}
                      </TableCell>
                      <TableCell className="text-sm">
                        {summaryItem !== undefined
                          ? `${(summaryItem.actualPercentage * 100).toFixed(1)}%`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            step={0.1}
                            value={getDisplayValue(assetType)}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [assetType.assetTypeId]: e.target.value,
                              }))
                            }
                            className="w-24 h-8 text-sm"
                          />
                          <span className="text-sm text-muted-foreground">%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {isDirty && (
                          <Button
                            size="sm"
                            onClick={() => handleSave(assetType.assetTypeId)}
                            disabled={isSaving}
                          >
                            {t("common.actions.save", "Salvar")}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>
    </div>
  );
};
