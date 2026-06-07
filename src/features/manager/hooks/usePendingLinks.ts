import { managerLinkService } from "@/features/manager/services/managerLinkService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/shared/hooks/useAuth";

export const usePendingLinks = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { isManager } = useAuth();

  const { data: pendingLinks = [], isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.pendingLinks,
    queryFn: () => managerLinkService.getPendingLinks(),
    staleTime: 30 * 1000,
    enabled: isManager,
  });

  const approveMutation = useMutation({
    mutationFn: (linkId: number) => managerLinkService.approveLink(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pendingLinks });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.managerClients() });
      toast.success(t("clients.linkApproved"));
    },
    onError: (error) => {
      toast.error(resolveErrorMessage(error, "clients.approveError"));
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (linkId: number) => managerLinkService.rejectLink(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.pendingLinks });
      toast.success(t("clients.linkRejected"));
    },
    onError: (error) => {
      toast.error(resolveErrorMessage(error, "clients.rejectError"));
    },
  });

  return {
    pendingLinks,
    pendingCount: pendingLinks.length,
    isLoading,
    error,
    approveLink: approveMutation.mutateAsync,
    rejectLink: rejectMutation.mutateAsync,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
};
