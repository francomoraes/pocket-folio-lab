import { useTranslation } from "react-i18next";
import { Card } from "@/shared/components/ui/card";
import CircularProgress from "@/shared/components/ui/circular-progress";
import { OperationLogEntry } from "@/shared/types/operationLog";
import { formatOperationLogDiff } from "@/shared/utils/formatOperationLogEntry";

interface OperationLogListProps {
  logs: OperationLogEntry[];
  isLoading: boolean;
}

export const OperationLogList = ({ logs, isLoading }: OperationLogListProps) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.resolvedLanguage || "pt-BR";

  if (isLoading) {
    return (
      <div className="p-4">
        <CircularProgress />
      </div>
    );
  }

  if (logs.length === 0) {
    return (
      <p className="p-4 text-sm text-muted-foreground">
        {t("history.log.empty")}
      </p>
    );
  }

  return (
    <Card className="divide-y">
      {logs.map((entry) => {
        const diff = formatOperationLogDiff(entry, t);
        const dateLabel = new Date(entry.createdAt).toLocaleString(locale, {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });

        return (
          <div key={entry.id} className="p-3 text-sm flex flex-col gap-0.5">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="text-muted-foreground">{dateLabel}</span>
              <span className="font-medium">{entry.actorEmail}</span>
              <span className="text-muted-foreground">
                ({t(`history.actors.${entry.actorRole}`)})
              </span>
            </div>
            <div>
              {t(`history.actions.${entry.action}`)}
              {diff && <span className="text-muted-foreground">: {diff}</span>}
            </div>
          </div>
        );
      })}
    </Card>
  );
};
