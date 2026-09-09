import { UserRole } from "@/shared/types/roles";

export function resolveHomePathForRole(role: UserRole | undefined): string {
  return role === "investor" ? "/dashboard" : "/manager/dashboard";
}
