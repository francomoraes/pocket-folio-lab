import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";
import { OverviewData, SummaryData } from "@/shared/types/summary";

class SummaryService {
  async getSummary(): Promise<SummaryData[]> {
    const response = await api.get<SummaryData[]>(API_ENDPOINTS.summary.get);
    return response.data;
  }
  async getOverviewByCurrency(): Promise<OverviewData[]> {
    const response = await api.get<OverviewData[]>(
      API_ENDPOINTS.summary.overviewByCurrency,
    );
    return response.data;
  }
}

export const summaryService = new SummaryService();
