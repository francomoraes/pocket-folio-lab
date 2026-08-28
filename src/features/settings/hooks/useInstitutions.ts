import { institutionService } from "@/features/settings/services/institutionService";
import { managerService } from "@/features/manager/services/managerService";
import { QUERY_KEYS } from "@/shared/constants/queryKeys";
import {
  CreateInstitution,
  UpdateInstitution,
} from "@/shared/types/institution";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";

export const useInstitutions = (
  investorId?: number,
  options?: { enabled?: boolean },
) => {
  const queryClient = useQueryClient();

  const queryKey = investorId
    ? QUERY_KEYS.clientInstitutions(investorId)
    : QUERY_KEYS.INSTITUTIONS;

  const {
    data: rawInstitutions,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey,
    queryFn: async () =>
      investorId
        ? managerService.listClientInstitutions(investorId)
        : institutionService.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    enabled: options?.enabled ?? true,
  });

  const institutions = rawInstitutions ?? [];

  const createInstitutionMutation = useMutation({
    mutationFn: (data: CreateInstitution) => {
      return investorId
        ? managerService.createClientInstitution(investorId, data)
        : institutionService.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(
          error,
          "auth.errorCodes.INSTITUTION_ALREADY_EXISTS",
        ),
      );
    },
  });

  const updateInstitutionMutation = useMutation({
    mutationFn: (data: UpdateInstitution) => {
      return investorId
        ? managerService.updateClientInstitution(investorId, data.id, data)
        : institutionService.update(data.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(resolveErrorMessage(error, "auth.messages.updateError"));
    },
  });

  const deleteInstitutionMutation = useMutation({
    mutationFn: (id: number) => {
      return investorId
        ? managerService.deleteClientInstitution(investorId, id)
        : institutionService.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (error: Error) => {
      toast.error(
        resolveErrorMessage(error, "auth.errorCodes.INSTITUTION_HAS_ASSETS"),
      );
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
