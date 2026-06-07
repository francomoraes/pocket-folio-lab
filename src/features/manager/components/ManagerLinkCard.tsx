import { ManagerClientLink } from "@/shared/types/manager";
import { LinkStatusBadge } from "./LinkStatusBadge";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";

interface ManagerLinkCardProps {
  link: ManagerClientLink;
  onRevoke: (linkId: number) => Promise<void>;
  isRevoking: boolean;
}

export const ManagerLinkCard = ({
  link,
  onRevoke,
  isRevoking,
}: ManagerLinkCardProps) => {
  const { t, i18n } = useTranslation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const locale = i18n.resolvedLanguage || "pt-BR";
  const fmt = (d: string | null) =>
    d ? new Date(d).toLocaleDateString(locale) : "—";

  const handleRevoke = async () => {
    await onRevoke(link.id);
    setConfirmOpen(false);
  };

  return (
    <>
      <Card className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium">{link.managerName}</span>
            <LinkStatusBadge status={link.status} />
          </div>
          <p className="text-sm text-muted-foreground">{link.managerEmail}</p>
          <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-3">
            <span>
              {t("managers.linkInfo.requestedAt")}: {fmt(link.createdAt)}
            </span>
            {link.activatedAt && (
              <span>
                {t("managers.linkInfo.activatedAt")}: {fmt(link.activatedAt)}
              </span>
            )}
            {link.rejectedAt && (
              <span>
                {t("managers.linkInfo.rejectedAt")}: {fmt(link.rejectedAt)}
              </span>
            )}
            {link.revokedAt && (
              <span>
                {t("managers.linkInfo.revokedAt")}: {fmt(link.revokedAt)}
              </span>
            )}
          </div>
        </div>

        {(link.status === "pending" || link.status === "active") && (
          <Button
            variant={link.status === "active" ? "destructive" : "outline"}
            size="sm"
            onClick={() => setConfirmOpen(true)}
          >
            {link.status === "pending"
              ? t("managers.cancelRequest")
              : t("managers.endLink")}
          </Button>
        )}
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("managers.confirmRevoke.title")}</DialogTitle>
            <DialogDescription>
              {t("managers.confirmRevoke.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              {t("managers.confirmRevoke.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleRevoke}
              disabled={isRevoking}
            >
              {t("managers.confirmRevoke.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
