import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  createUserSchema,
  type CreateUserFormData,
} from "@/schemas/user.schema";
import { useCreateUser } from "@/features/users/hooks/useCreateUser";
import { UserRole } from "@/shared/types/roles";
import { CreatedUser } from "@/features/users/services/userService";

interface CreateUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allowedRoles: UserRole[];
  onCreated?: (user: CreatedUser) => void;
}

export const CreateUserDialog = ({
  open,
  onOpenChange,
  allowedRoles,
  onCreated,
}: CreateUserDialogProps) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: allowedRoles[0] },
  });

  const { createUser, isCreating } = useCreateUser({
    onSuccess: (user) => {
      onOpenChange(false);
      onCreated?.(user);
    },
  });

  useEffect(() => {
    if (open) {
      reset({ name: "", email: "", password: "", role: allowedRoles[0] });
      setShowPassword(false);
    }
  }, [open, allowedRoles, reset]);

  const onSubmit = async (data: CreateUserFormData) => {
    await createUser(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("users.create.title")}</DialogTitle>
          <DialogDescription>{t("users.create.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="create-user-name">{t("users.create.name")}</Label>
            <Input
              id="create-user-name"
              {...register("name")}
              disabled={isCreating}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-user-email">{t("users.create.email")}</Label>
            <Input
              id="create-user-email"
              type="email"
              {...register("email")}
              disabled={isCreating}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-user-password">
              {t("users.create.password")}
            </Label>
            <div className="relative">
              <Input
                id="create-user-password"
                type={showPassword ? "text" : "password"}
                {...register("password")}
                disabled={isCreating}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              {t("users.create.passwordHint")}
            </p>
          </div>

          {allowedRoles.length > 1 && (
            <div className="space-y-2">
              <Label htmlFor="create-user-role">{t("users.create.role")}</Label>
              <Select
                value={watch("role")}
                onValueChange={(v) => setValue("role", v as UserRole)}
                disabled={isCreating}
              >
                <SelectTrigger id="create-user-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {allowedRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {t(`admin.users.roles.${role}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isCreating}
            >
              {t("users.create.cancel")}
            </Button>
            <Button type="submit" disabled={isCreating}>
              {t("users.create.submit")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
