import { managerLinkService } from "@/features/manager/services/managerLinkService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useMyLinkHistory = () => {
  const { data: history = [], isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.myLinkHistory,
    queryFn: () => managerLinkService.getMyHistory(),
    staleTime: 60 * 1000,
  });

  return { history, isLoading, error };
};
