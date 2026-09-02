import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ManagerContextBanner } from "@/features/manager/components/ManagerContextBanner";
import { LinkHistoryTable } from "@/features/manager/components/LinkHistoryTable";
import { useClientLinkHistory } from "@/features/manager/hooks/useClientLinkHistory";
import { useClientOperationLogs } from "@/features/manager/hooks/useClientOperationLogs";
import { usePagination } from "@/shared/hooks/usePagination";
import { PaginationControls } from "@/shared/components/ui/pagination-control";
import { OperationLogList } from "@/shared/components/OperationLogList";
import { Card } from "@/shared/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

export const ClientHistoryPage = () => {
  const { investorId } = useParams<{ investorId: string }>();
  const id = Number(investorId);
  const { t } = useTranslation();

  const { history, isLoading: isLoadingHistory } = useClientLinkHistory(id);

  const pagination = usePagination({ initialItemsPerPage: 20 });
  const { page, itemsPerPage, setMeta } = pagination;
  const {
    logs,
    meta: responseMeta,
    isLoading: isLoadingLogs,
  } = useClientOperationLogs(id, { page, itemsPerPage });

  useEffect(() => {
    if (responseMeta) setMeta(responseMeta);
  }, [responseMeta, setMeta]);

  return (
    <div className="flex flex-col h-[calc(100vh-61px)]">
      <ManagerContextBanner investorId={id} />

      <div className="flex flex-col gap-3 flex-1 min-h-0 p-4 max-w-5xl w-full mx-auto overflow-hidden">
        <h1 className="text-2xl font-bold shrink-0">{t("history.title")}</h1>

        <Tabs defaultValue="log" className="flex flex-col flex-1 min-h-0">
          <TabsList className="shrink-0">
            <TabsTrigger value="log">{t("history.log.title")}</TabsTrigger>
            <TabsTrigger value="linkHistory">
              {t("history.linkHistory.title")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="log" className="flex flex-col flex-1 min-h-0 mt-3 gap-2">
            <div className="overflow-auto flex-1 min-h-0">
              <OperationLogList logs={logs} isLoading={isLoadingLogs} />
            </div>
            <PaginationControls pagination={pagination} />
          </TabsContent>

          <TabsContent value="linkHistory" className="flex flex-col flex-1 min-h-0 mt-3">
            <Card className="flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="overflow-auto flex-1 min-h-0">
                <LinkHistoryTable history={history} isLoading={isLoadingHistory} />
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
