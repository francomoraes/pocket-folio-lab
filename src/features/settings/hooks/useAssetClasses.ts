import { assetClassService } from "@/features/settings/services/assetClassService";
import { managerService } from "@/features/manager/services/managerService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { CreateAssetClass, UpdateAssetClass } from "@/shared/types/assetClass";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";

export const useAssetClasses = (investorId?: number) => {
  const queryClient = useQueryClient();

  const queryKey = investorId
    ? QUERY_KEYS.clientAssetClasses(investorId)
    : QUERY_KEYS.ASSET_CLASSES;

  const {
    data: rawAssetClasses,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () =>
      investorId
        ? managerService.listClientAssetClasses(investorId)
        : assetClassService.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const assetClasses = rawAssetClasses ?? [];

  const createAssetClassMutation = useMutation({
    mutationFn: (data: CreateAssetClass) => {
      return investorId
        ? managerService.createClientAssetClass(investorId, data)
        : assetClassService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(
          error,
          "auth.errorCodes.ASSET_CLASS_ALREADY_EXISTS",
        ),
      );
    },
  });

  const updateAssetClassMutation = useMutation({
    mutationFn: (data: UpdateAssetClass) => {
      return investorId
        ? managerService.updateClientAssetClass(investorId, data.id, data)
        : assetClassService.update(data.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(resolveErrorMessage(error, "auth.messages.updateError"));
    },
  });

  const deleteAssetClassMutation = useMutation({
    mutationFn: (id: number) => {
      return investorId
        ? managerService.deleteClientAssetClass(investorId, id)
        : assetClassService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(
          error,
          "auth.errorCodes.ASSET_CLASS_HAS_ASSET_TYPES",
        ),
      );
    },
  });

  return {
    assetClasses,
    isLoading,
    error,

    createAssetClass: createAssetClassMutation.mutateAsync,
    updateAssetClass: updateAssetClassMutation.mutateAsync,
    deleteAssetClass: deleteAssetClassMutation.mutateAsync,

    isCreating: createAssetClassMutation.isPending,
    isUpdating: updateAssetClassMutation.isPending,
    isDeleting: deleteAssetClassMutation.isPending,

    refetch,
  };
};
