import { managerService } from "@/features/manager/services/managerService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useAvailableManagers = (search?: string, enabled = true) => {
  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.availableManagers(search),
    queryFn: () => managerService.getAvailableManagers({ search, page: 1, itemsPerPage: 20 }),
    staleTime: 30 * 1000,
    enabled,
  });

  return {
    managers: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    error,
  };
};
