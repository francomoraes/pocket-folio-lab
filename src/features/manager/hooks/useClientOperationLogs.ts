import { useQuery } from "@tanstack/react-query";
import { managerService } from "@/features/manager/services/managerService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { OperationLogAction } from "@/shared/types/operationLog";

export const useClientOperationLogs = (
  investorId: number,
  params?: { page?: number; itemsPerPage?: number; action?: OperationLogAction },
) => {
  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.clientOperationLogs(investorId, params),
    queryFn: () => managerService.getClientOperationLogs(investorId, params),
    enabled: !!investorId,
    staleTime: 60 * 1000,
  });

  return {
    logs: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    error,
  };
};
