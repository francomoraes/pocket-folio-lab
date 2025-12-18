import { institutionService } from "@/features/settings/services/institutionService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import {
  CreateInstitution,
  UpdateInstitution,
} from "@/shared/types/institution";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useInstitutions = () => {
  const queryClient = useQueryClient();

  const {
    data: institutions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: QUERY_KEYS.INSTITUTIONS,
    queryFn: async () => institutionService.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  const createInstitutionMutation = useMutation({
    mutationFn: (data: CreateInstitution) => {
      return institutionService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INSTITUTIONS });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error creating institution");
    },
  });

  const updateInstitutionMutation = useMutation({
    mutationFn: (data: UpdateInstitution) => {
      return institutionService.update(data.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INSTITUTIONS });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error updating asset class");
    },
  });

  const deleteInstitutionMutation = useMutation({
    mutationFn: (id: number) => {
      return institutionService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.INSTITUTIONS });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Error deleting institution");
    },
  });

  return {
    institutions,
    isLoading,
    error,

    createInstitution: createInstitutionMutation.mutateAsync,
    updateInstitution: updateInstitutionMutation.mutateAsync,
    deleteInstitution: deleteInstitutionMutation.mutateAsync,

    isCreating: createInstitutionMutation.isPending,
    isUpdating: updateInstitutionMutation.isPending,
    isDeleting: deleteInstitutionMutation.isPending,

    refetch,
  };
};
