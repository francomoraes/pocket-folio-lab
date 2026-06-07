import { managerService } from "@/features/manager/services/managerService";
import { managerLinkService } from "@/features/manager/services/managerLinkService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";
import { useTranslation } from "react-i18next";

export const useManagerClients = (params?: {
  search?: string;
  page?: number;
  itemsPerPage?: number;
  sortBy?: string;
  order?: string;
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data, isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.managerClients(params),
    queryFn: () => managerService.getMyClients(params ?? {}),
    staleTime: 30 * 1000,
  });

  const revokeMutation = useMutation({
    mutationFn: (linkId: number) => managerLinkService.revokeLink(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["manager", "clients"] });
      toast.success(t("clients.linkRevoked"));
    },
    onError: (error) => {
      toast.error(resolveErrorMessage(error, "clients.revokeError"));
    },
  });

  return {
    clients: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    error,
    revokeLink: revokeMutation.mutateAsync,
    isRevoking: revokeMutation.isPending,
  };
};
