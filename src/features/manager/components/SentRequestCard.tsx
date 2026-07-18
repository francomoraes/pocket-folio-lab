import { SentRequest } from "@/shared/types/manager";
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

interface SentRequestCardProps {
  request: SentRequest;
  onCancel: (linkId: number) => Promise<void>;
  isCancelling: boolean;
}

export const SentRequestCard = ({
  request,
  onCancel,
  isCancelling,
}: SentRequestCardProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage || "pt-BR";
  const [confirmOpen, setConfirmOpen] = useState(false);
  const fmt = (d: string) => new Date(d).toLocaleDateString(locale);

  return (
    <>
      <Card className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium">{request.investorName}</p>
          <p className="text-sm text-muted-foreground">{request.investorEmail}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t("managers.linkInfo.requestedAt")}: {fmt(request.createdAt)}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setConfirmOpen(true)}
        >
          {t("clients.cancelRequest")}
        </Button>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("clients.confirmCancelRequest.title")}</DialogTitle>
            <DialogDescription>
              {t("clients.confirmCancelRequest.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              {t("clients.confirmCancelRequest.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await onCancel(request.id);
                setConfirmOpen(false);
              }}
              disabled={isCancelling}
            >
              {t("clients.confirmCancelRequest.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
