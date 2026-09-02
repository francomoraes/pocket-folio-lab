import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMyOperationLogs } from "@/features/history/hooks/useMyOperationLogs";
import { usePagination } from "@/shared/hooks/usePagination";
import { PaginationControls } from "@/shared/components/ui/pagination-control";
import { OperationLogList } from "@/shared/components/OperationLogList";

export const HistoryPage = () => {
  const { t } = useTranslation();
  const pagination = usePagination({ initialItemsPerPage: 20 });
  const { page, itemsPerPage, setMeta } = pagination;

  const {
    logs,
    meta: responseMeta,
    isLoading,
  } = useMyOperationLogs({
    page,
    itemsPerPage,
  });

  useEffect(() => {
    if (responseMeta) setMeta(responseMeta);
  }, [responseMeta, setMeta]);

  return (
    <div className="flex flex-col gap-3 h-[calc(100vh-61px)] p-4 max-w-3xl w-full mx-auto overflow-hidden">
      <div className="shrink-0">
        <h1 className="text-2xl font-bold">{t("history.title")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("history.log.subtitle")}
        </p>
      </div>

      <div className="overflow-auto flex-1 min-h-0">
        <OperationLogList logs={logs} isLoading={isLoading} />
      </div>

      <PaginationControls pagination={pagination} />
    </div>
  );
};
