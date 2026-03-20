import { assetClassService } from "@/features/settings/services/assetClassService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import { CreateAssetClass, UpdateAssetClass } from "@/shared/types/assetClass";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useAssetClasses = () => {
  const queryClient = useQueryClient();

  const {
    data: rawAssetClasses,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.ASSET_CLASSES,
    queryFn: async () => assetClassService.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const assetClasses = rawAssetClasses ?? [];

  const createAssetClassMutation = useMutation({
    mutationFn: (data: CreateAssetClass) => {
      return assetClassService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSET_CLASSES });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error creating asset class");
    },
  });

  const updateAssetClassMutation = useMutation({
    mutationFn: (data: UpdateAssetClass) => {
      return assetClassService.update(data.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSET_CLASSES });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error updating asset class");
    },
  });

  const deleteAssetClassMutation = useMutation({
    mutationFn: (id: number) => {
      return assetClassService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSET_CLASSES });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error deleting asset class");
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
