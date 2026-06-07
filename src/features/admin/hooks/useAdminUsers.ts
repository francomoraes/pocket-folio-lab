import { adminService } from "@/features/admin/services/adminService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserRole } from "@/shared/types/roles";
import { toast } from "sonner";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";
import { useTranslation } from "react-i18next";

export const useAdminUsers = (params?: {
  search?: string;
  page?: number;
  itemsPerPage?: number;
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.adminUsers(params),
    queryFn: () => adminService.listUsers(params ?? {}),
    staleTime: 30 * 1000,
  });

  const setRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: UserRole }) =>
      adminService.setUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success(t("admin.users.roleUpdated"));
    },
    onError: (error) => {
      toast.error(resolveErrorMessage(error, "admin.users.roleUpdateError"));
    },
  });

  const setClientLimitMutation = useMutation({
    mutationFn: ({ managerId, limit }: { managerId: number; limit: number }) =>
      adminService.setManagerClientLimit(managerId, limit),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success(t("admin.users.limitUpdated"));
    },
    onError: (error) => {
      toast.error(resolveErrorMessage(error, "admin.users.limitUpdateError"));
    },
  });

  return {
    users: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    error,
    setUserRole: setRoleMutation.mutateAsync,
    setManagerClientLimit: setClientLimitMutation.mutateAsync,
    isSettingRole: setRoleMutation.isPending,
    isSettingLimit: setClientLimitMutation.isPending,
  };
};
