import { useQuery } from "@tanstack/react-query";
import { managerService } from "@/features/manager/services/managerService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";

export const useClientLinkHistory = (investorId: number) => {
  const { data: history = [], isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.clientLinkHistory(investorId),
    queryFn: () => managerService.getClientLinkHistory(investorId),
    enabled: !!investorId,
    staleTime: 60 * 1000,
  });

  return { history, isLoading, error };
};
