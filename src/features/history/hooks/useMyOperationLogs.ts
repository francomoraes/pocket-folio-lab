import { useQuery } from "@tanstack/react-query";
import { operationLogService } from "@/features/history/services/operationLogService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { OperationLogAction } from "@/shared/types/operationLog";

export const useMyOperationLogs = (params?: {
  page?: number;
  itemsPerPage?: number;
  action?: OperationLogAction;
}) => {
  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.myOperationLogs(params),
    queryFn: () => operationLogService.getMyLogs(params),
    staleTime: 60 * 1000,
  });

  return {
    logs: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    error,
  };
};
