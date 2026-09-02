import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";
import { OperationLogAction, OperationLogListResponse } from "@/shared/types/operationLog";

class OperationLogService {
  async getMyLogs(params?: {
    page?: number;
    itemsPerPage?: number;
    action?: OperationLogAction;
  }): Promise<OperationLogListResponse> {
    const response = await api.get<OperationLogListResponse>(
      API_ENDPOINTS.operationLogs.list,
      { params },
    );
    return response.data;
  }
}

export const operationLogService = new OperationLogService();
