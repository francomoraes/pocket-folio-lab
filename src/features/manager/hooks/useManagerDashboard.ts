import { managerService } from "@/features/manager/services/managerService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useManagerDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.managerDashboard,
    queryFn: () => managerService.getDashboard(),
    staleTime: 60 * 1000,
  });

  return { dashboard: data, isLoading, error };
};
