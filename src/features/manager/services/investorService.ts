import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";
import { AvailableInvestor, PaginationMeta } from "@/shared/types/manager";

class InvestorService {
  async getAvailableInvestors(params: {
    search?: string;
    page?: number;
    itemsPerPage?: number;
    excludeManagerId?: number;
  }): Promise<{ data: AvailableInvestor[]; meta: PaginationMeta }> {
    const response = await api.get<{
      data: AvailableInvestor[];
      meta: PaginationMeta;
    }>(API_ENDPOINTS.investors.list, { params });
    return response.data;
  }
}

export const investorService = new InvestorService();
