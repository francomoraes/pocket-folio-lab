import { managerLinkService } from "@/features/manager/services/managerLinkService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";
import { useTranslation } from "react-i18next";

export const useMyLinks = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  const { data: links = [], isLoading, error } = useQuery({
    queryKey: QUERY_KEYS.myLinks,
    queryFn: () => managerLinkService.getMyLinks(),
    staleTime: 30 * 1000,
  });

  const createLinkMutation = useMutation({
    mutationFn: (managerId: number) => managerLinkService.createLink(managerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myLinks });
      toast.success(t("managers.requestSent"));
    },
    onError: (error) => {
      toast.error(resolveErrorMessage(error, "managers.requestError"));
    },
  });

  const revokeLinkMutation = useMutation({
    mutationFn: (linkId: number) => managerLinkService.revokeLink(linkId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.myLinks });
      toast.success(t("managers.linkRevoked"));
    },
    onError: (error) => {
      toast.error(resolveErrorMessage(error, "managers.revokeError"));
    },
  });

  return {
    links,
    isLoading,
    error,
    createLink: createLinkMutation.mutateAsync,
    revokeLink: revokeLinkMutation.mutateAsync,
    isCreating: createLinkMutation.isPending,
    isRevoking: revokeLinkMutation.isPending,
  };
};
