import { assetClassService } from "@/services/assetClassService";
import { CreateAssetClass, UpdateAssetClass } from "@/types/assetClass";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const ASSET_CLASSES_QUERY_KEY = ["asset-classes"];

export const useAssetClasses = () => {
  const queryClient = useQueryClient();

  const {
    data: assetClasses,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ASSET_CLASSES_QUERY_KEY,
    queryFn: async () => assetClassService.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const createAssetMutation = useMutation({
    mutationFn: (data: CreateAssetClass) => {
      return assetClassService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSET_CLASSES_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error creating asset class");
    },
  });

  const updateAssetMutation = useMutation({
    mutationFn: (data: UpdateAssetClass) => {
      return assetClassService.update(data.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSET_CLASSES_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error updating asset class");
    },
  });

  const deleteAssetMutation = useMutation({
    mutationFn: (id: number) => {
      return assetClassService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSET_CLASSES_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error deleting asset class");
    },
  });

  return {
    assetClasses,
    isLoading,
    error,

    createAssetClass: createAssetMutation.mutateAsync,
    updateAssetClass: updateAssetMutation.mutateAsync,
    deleteAssetClass: deleteAssetMutation.mutateAsync,

    isCreating: createAssetMutation.isPending,
    isUpdating: updateAssetMutation.isPending,
    isDeleting: deleteAssetMutation.isPending,

    refetch,
  };
};
