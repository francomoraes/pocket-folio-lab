import { managerLinkService } from "@/features/manager/services/managerLinkService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";
import { useTranslation } from "react-i18next";

export const useSentRequests = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: sentRequests = [], isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.sentRequests,
    queryFn: () => managerLinkService.getSentRequests(),
    staleTime: 30 * 1000,
  });

  const cancelMutation = useMutation({
    mutationFn: (linkId: number) => managerLinkService.revokeLink(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.sentRequests });
      toast.success(t("clients.requestCancelled"));
    },
    onError: (error) => {
      toast.error(resolveErrorMessage(error, "clients.cancelRequestError"));
    },
  });

  return {
    sentRequests,
    isLoading,
    error,
    cancelRequest: cancelMutation.mutateAsync,
    isCancelling: cancelMutation.isPending,
  };
};
