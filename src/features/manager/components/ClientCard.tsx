import { ManagerClient } from "@/shared/types/manager";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { formatCentsToCurrency } from "@/shared/utils/formatters";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface ClientCardProps {
  client: ManagerClient;
  onRevoke: (linkId: number) => Promise<void>;
  isRevoking: boolean;
}

export const ClientCard = ({
  client,
  onRevoke,
  isRevoking,
}: ClientCardProps) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const locale = i18n.resolvedLanguage || "pt-BR";
  const fmt = (d: string) => new Date(d).toLocaleDateString(locale);

  return (
    <>
      <Card className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium">{client.investorName}</p>
          <p className="text-sm text-muted-foreground">
            {client.investorEmail}
          </p>
          <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-3">
            <span>
              {t("clients.table.linkedAt")}: {fmt(client.activatedAt)}
            </span>
            <span>
              {t("clients.table.wealth")}:{" "}
              {formatCentsToCurrency(client.currentWealthCents, "BRL")}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() =>
              navigate(`/manager/clients/${client.investorId}/targets`)
            }
          >
            {t("clients.table.viewPortfolio")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setConfirmOpen(true)}
          >
            {t("clients.table.endLink")}
          </Button>
        </div>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("clients.confirmRevoke.title")}</DialogTitle>
            <DialogDescription>
              {t("clients.confirmRevoke.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              {t("clients.confirmRevoke.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await onRevoke(client.linkId);
                setConfirmOpen(false);
              }}
              disabled={isRevoking}
            >
              {t("clients.confirmRevoke.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
