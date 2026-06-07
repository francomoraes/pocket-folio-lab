import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAdminUsers } from "@/features/admin/hooks/useAdminUsers";
import { AdminUser } from "@/shared/types/manager";
import { UserRole } from "@/shared/types/roles";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card } from "@/shared/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { ClientLimitDialog } from "./ClientLimitDialog";
import { Pencil } from "lucide-react";
import CircularProgress from "@/shared/components/ui/circular-progress";

const ROLES: UserRole[] = ["investor", "manager", "admin"];

export const UsersTable = () => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [pendingRoleChange, setPendingRoleChange] = useState<{
    user: AdminUser;
    newRole: UserRole;
  } | null>(null);
  const [limitDialogUser, setLimitDialogUser] = useState<AdminUser | null>(
    null,
  );

  const { users, isLoading, setUserRole, setManagerClientLimit, isSettingRole, isSettingLimit } =
    useAdminUsers({ search: debouncedSearch || undefined, page: 1, itemsPerPage: 50 });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    clearTimeout((handleSearchChange as any)._timer);
    (handleSearchChange as any)._timer = setTimeout(
      () => setDebouncedSearch(value),
      400,
    );
  };

  const handleRoleSelect = (user: AdminUser, newRole: UserRole) => {
    if (newRole === user.role) return;
    setPendingRoleChange({ user, newRole });
  };

  const confirmRoleChange = async () => {
    if (!pendingRoleChange) return;
    await setUserRole({
      userId: pendingRoleChange.user.id,
      role: pendingRoleChange.newRole,
    });
    setPendingRoleChange(null);
  };

  const isDowngrade =
    pendingRoleChange?.user.role === "manager" ||
    pendingRoleChange?.user.role === "admin";

  if (isLoading) return <CircularProgress />;

  return (
    <div className="flex flex-col gap-3">
      <Input
        placeholder={t("admin.users.search")}
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="max-w-sm"
      />

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("admin.users.table.name")}</TableHead>
              <TableHead>{t("admin.users.table.email")}</TableHead>
              <TableHead>{t("admin.users.table.role")}</TableHead>
              <TableHead>{t("admin.users.table.clientLimit")}</TableHead>
              <TableHead className="text-right">
                {t("admin.users.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {user.email}
                </TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onValueChange={(v) => handleRoleSelect(user, v as UserRole)}
                    disabled={isSettingRole}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r} value={r}>
                          {t(`admin.users.roles.${r}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-sm">
                  {user.role === "manager" || user.role === "admin"
                    ? user.managerClientLimit ?? t("admin.users.table.noLimit")
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  {(user.role === "manager" || user.role === "admin") && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setLimitDialogUser(user)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {pendingRoleChange && (
        <Dialog
          open={!!pendingRoleChange}
          onOpenChange={(o) => !o && setPendingRoleChange(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("admin.users.confirmRoleChange.title")}</DialogTitle>
              {isDowngrade && (
                <DialogDescription className="text-destructive">
                  {t("admin.users.confirmRoleChange.downgradeWarning")}
                </DialogDescription>
              )}
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setPendingRoleChange(null)}
              >
                {t("admin.users.confirmRoleChange.cancel")}
              </Button>
              <Button onClick={confirmRoleChange} disabled={isSettingRole}>
                {t("admin.users.confirmRoleChange.confirm")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {limitDialogUser && (
        <ClientLimitDialog
          open={!!limitDialogUser}
          onOpenChange={(o) => !o && setLimitDialogUser(null)}
          managerId={limitDialogUser.id}
          currentLimit={limitDialogUser.managerClientLimit}
          onSave={(managerId, limit) =>
            setManagerClientLimit({ managerId, limit })
          }
          isSaving={isSettingLimit}
        />
      )}
    </div>
  );
};
