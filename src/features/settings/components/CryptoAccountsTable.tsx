import { useState } from "react";
import { ConfirmDeleteDialog } from "@/shared/components/ConfirmDeleteDialog";
import { CryptoAccountDialog } from "@/features/settings/components/CryptoAccountDialog";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Card } from "@/shared/components/ui/card";
import { useCryptoAccounts } from "@/features/settings/hooks/useCryptoAccounts";
import { CryptoAccount } from "@/shared/types/cryptoAccount";
import { Plus, RefreshCw, Trash2, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const statusDotClass: Record<CryptoAccount["status"], string> = {
  active: "bg-success",
  error: "bg-destructive",
  disabled: "bg-muted-foreground",
};

export const CryptoAccountsTable = () => {
  const { t } = useTranslation();
  const { accounts, isLoading, syncAccount, disconnectAccount } =
    useCryptoAccounts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [syncingIds, setSyncingIds] = useState<Set<number>>(new Set());
  const [deletingAccount, setDeletingAccount] =
    useState<CryptoAccount | null>(null);

  const handleSync = async (id: number) => {
    if (syncingIds.has(id)) return;

    setSyncingIds((prev) => new Set(prev).add(id));
    try {
      await syncAccount(id);
    } catch {
      // erro já reportado via toast em useCryptoAccounts
    } finally {
      setSyncingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  if (isLoading) return <div>{t("common.status.loading")}</div>;

  if (accounts.length === 0) {
    return (
      <div className="flex flex-col gap-3 p-3">
        <p>{t("settings.cryptoAccounts.empty")}</p>
        <div>
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t("settings.cryptoAccounts.connect")}
          </Button>
        </div>
        <CryptoAccountDialog open={dialogOpen} onOpenChange={setDialogOpen} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 h-[calc(100vh-216px)] p-3">
      <div className="flex justify-end">
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("settings.cryptoAccounts.connect")}
        </Button>
      </div>
      <Card className="flex-1 flex flex-col min-h-0">
        <Table>
          <TableHeader className="sticky top-0 bg-background z-10">
            <TableRow>
              <TableHead>{t("settings.cryptoAccounts.table.label")}</TableHead>
              <TableHead>
                {t("settings.cryptoAccounts.table.status")}
              </TableHead>
              <TableHead>
                {t("settings.cryptoAccounts.table.lastSyncedAt")}
              </TableHead>
              <TableHead className="text-right">
                {t("settings.cryptoAccounts.table.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {accounts.map((account) => (
              <TableRow key={account.id}>
                <TableCell>
                  {account.label || t("settings.cryptoAccounts.defaultLabel")}
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-2">
                    <span
                      className={`h-2 w-2 rounded-full ${statusDotClass[account.status]}`}
                    />
                    {t(`settings.cryptoAccounts.status.${account.status}`)}
                    {account.status === "error" && account.lastSyncError && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <AlertCircle className="h-4 w-4 text-destructive cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          {account.lastSyncError}
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </span>
                </TableCell>
                <TableCell>
                  {account.lastSyncedAt
                    ? new Date(account.lastSyncedAt).toLocaleString()
                    : "-"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSync(account.id)}
                      disabled={syncingIds.has(account.id)}
                    >
                      <RefreshCw
                        className={`h-4 w-4 ${syncingIds.has(account.id) ? "animate-spin" : ""}`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeletingAccount(account)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <CryptoAccountDialog open={dialogOpen} onOpenChange={setDialogOpen} />

      <ConfirmDeleteDialog
        open={!!deletingAccount}
        onOpenChange={(open) => {
          if (!open) setDeletingAccount(null);
        }}
        onConfirm={async () => {
          if (deletingAccount) {
            await disconnectAccount(deletingAccount.id);
            setDeletingAccount(null);
          }
        }}
      />
    </div>
  );
};
