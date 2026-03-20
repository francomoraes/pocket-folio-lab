import { z } from "zod";
import i18n from "@/shared/i18n/config";

// Validador de senha customizado com mensagens específicas
const passwordSchema = z
  .string()
  .min(6, i18n.t("common.validation.minLength", { min: 6 }))
  .max(100, i18n.t("common.validation.maxLength", { max: 100 }))
  .refine((val) => /[a-z]/.test(val), {
    message: i18n.t("auth.validation.passwordLowercase"),
  })
  .refine((val) => /[A-Z]/.test(val), {
    message: i18n.t("auth.validation.passwordUppercase"),
  })
  .refine((val) => /\d/.test(val), {
    message: i18n.t("auth.validation.passwordNumber"),
  })
  .refine((val) => /[@$!%*?&]/.test(val), {
    message: i18n.t("auth.validation.passwordSymbol"),
  });

// Schema para login (validação simples)
export const loginSchema = z.object({
  email: z.string().email(i18n.t("common.validation.invalidEmail")),
  password: z
    .string()
    .min(6, i18n.t("common.validation.minLength", { min: 6 })),
});

// Schema para registro (validação completa)
export const registerSchema = z.object({
  name: z.string().min(1, i18n.t("common.validation.required")),
  email: z.string().email(i18n.t("common.validation.invalidEmail")),
  password: passwordSchema,
});

// Tipos inferidos
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
