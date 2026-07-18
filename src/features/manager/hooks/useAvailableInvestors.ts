import { investorService } from "@/features/manager/services/investorService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useAvailableInvestors = (search?: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.availableInvestors(search),
    queryFn: () => investorService.getAvailableInvestors({ search, page: 1, itemsPerPage: 20 }),
    staleTime: 30 * 1000,
  });

  return {
    investors: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    error,
  };
};
