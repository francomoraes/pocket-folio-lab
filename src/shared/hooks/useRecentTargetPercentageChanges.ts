import { useQuery } from "@tanstack/react-query";
import { operationLogService } from "@/features/history/services/operationLogService";
import { managerService } from "@/features/manager/services/managerService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { OperationLogEntry } from "@/shared/types/operationLog";

const RECENT_WINDOW_DAYS = 30;
const BATCH_SIZE = 100;

export type RecentTargetPercentageChange = {
  beforeTargetPercentage: number | null;
  afterTargetPercentage: number | null;
  actorEmail: string;
  createdAt: string;
};

// Badge "alterado em dd/mm" (decisão 4.4 de .docs/historico-de-operacoes.md) —
// une target_percentage_change (endpoint estreito) e asset_type_updated com
// targetPercentage no diff (CRUD genérico), mantendo só a entrada mais
// recente por AssetType, dentro da janela de 30 dias (decisão confirmada
// em 2026-08-24).
function buildRecentChangesMap(
  entries: OperationLogEntry[],
): Map<number, RecentTargetPercentageChange> {
  const map = new Map<number, RecentTargetPercentageChange>();
  const cutoff = Date.now() - RECENT_WINDOW_DAYS * 24 * 60 * 60 * 1000;

  for (const entry of entries) {
    if (entry.entityType !== "AssetType" || entry.entityId === null) continue;
    if (
      entry.action !== "target_percentage_change" &&
      entry.action !== "asset_type_updated"
    ) {
      continue;
    }
    if (entry.afterValue?.targetPercentage === undefined) continue;
    if (new Date(entry.createdAt).getTime() < cutoff) continue;
    if (map.has(entry.entityId)) continue; // já viu uma entrada mais recente (ordenado DESC)

    map.set(entry.entityId, {
      beforeTargetPercentage: (entry.beforeValue?.targetPercentage as number) ?? null,
      afterTargetPercentage: entry.afterValue.targetPercentage as number,
      actorEmail: entry.actorEmail,
      createdAt: entry.createdAt,
    });
  }

  return map;
}

export const useRecentTargetPercentageChanges = (investorId?: number) => {
  const isClientContext = investorId !== undefined;

  const { data } = useQuery({
    queryKey: isClientContext
      ? QUERY_KEYS.clientOperationLogs(investorId, { itemsPerPage: BATCH_SIZE })
      : QUERY_KEYS.myOperationLogs({ itemsPerPage: BATCH_SIZE }),
    queryFn: () =>
      isClientContext
        ? managerService.getClientOperationLogs(investorId, {
            itemsPerPage: BATCH_SIZE,
          })
        : operationLogService.getMyLogs({ itemsPerPage: BATCH_SIZE }),
    staleTime: 60 * 1000,
  });

  return buildRecentChangesMap(data?.data ?? []);
};
