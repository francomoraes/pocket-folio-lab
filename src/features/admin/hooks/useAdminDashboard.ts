import { adminService } from "@/features/admin/services/adminService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useQuery } from "@tanstack/react-query";

export const useAdminDashboard = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.adminDashboard,
    queryFn: () => adminService.getDashboard(),
    staleTime: 60 * 1000,
  });

  return { dashboard: data, isLoading, error };
};
