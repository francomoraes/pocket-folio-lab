import { z } from "zod";
import i18n from "@/shared/i18n/config";
import { passwordSchema } from "@/schemas/auth.schema";

export const createUserSchema = z.object({
  name: z.string().min(1, i18n.t("common.validation.required")),
  email: z.string().email(i18n.t("common.validation.invalidEmail")),
  password: passwordSchema,
  role: z.enum(["investor", "manager", "admin"]),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;
