import { useMutation } from "@tanstack/react-query";
import {
  userService,
  CreateUserPayload,
  CreatedUser,
} from "@/features/users/services/userService";
import { toast } from "sonner";
import { resolveErrorMessage } from "@/lib/resolveErrorMessage";
import { useTranslation } from "react-i18next";

export const useCreateUser = (options?: {
  onSuccess?: (user: CreatedUser) => void;
}) => {
  const { t } = useTranslation();

  const mutation = useMutation({
    mutationFn: (payload: CreateUserPayload) =>
      userService.createUser(payload),
    onSuccess: (user) => {
      toast.success(t("users.create.success"));
      options?.onSuccess?.(user);
    },
    onError: (error) => {
      toast.error(resolveErrorMessage(error, "users.create.error"));
    },
  });

  return {
    createUser: mutation.mutateAsync,
    isCreating: mutation.isPending,
  };
};
