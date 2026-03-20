import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";
import {
  WealthHistory,
  CreateWealthHistoryRequest,
  UpdateWealthHistoryRequest,
} from "@/shared/types/wealthHistory";

class WealthHistoryService {
  async getWealthHistory(): Promise<WealthHistory[]> {
    const response = await api.get<WealthHistory[]>(
      API_ENDPOINTS.wealthHistory.list,
    );
    return response.data;
  }

  async createWealthHistory(
    data: CreateWealthHistoryRequest,
  ): Promise<WealthHistory> {
    const response = await api.post<WealthHistory>(
      API_ENDPOINTS.wealthHistory.create,
      data,
    );
    return response.data;
  }

  async updateWealthHistory(
    id: number,
    data: UpdateWealthHistoryRequest,
  ): Promise<WealthHistory> {
    const url = API_ENDPOINTS.wealthHistory.update.replace(
      ":id",
      id.toString(),
    );
    const response = await api.put<WealthHistory>(url, data);
    return response.data;
  }

  async deleteWealthHistory(id: number): Promise<void> {
    const url = API_ENDPOINTS.wealthHistory.delete.replace(
      ":id",
      id.toString(),
    );
    await api.delete<void>(url);
  }

  async getMarketIndicesHistory(
    startDate: string,
    endDate: string,
  ): Promise<{
    cdi: Array<{ date: string; value: number }>;
    ipca: Array<{ date: string; value: number }>;
    sp500: Array<{ date: string; value: number }>;
  }> {
    const response = await api.get<{
      cdi: Array<{ date: string; value: number }>;
      ipca: Array<{ date: string; value: number }>;
      sp500: Array<{ date: string; value: number }>;
    }>(`${API_ENDPOINTS.wealthHistory.list}/market-indices`, {
      params: { startDate, endDate },
    });
    return response.data;
  }
}

export const wealthHistoryService = new WealthHistoryService();
