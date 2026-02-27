import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";

import {
  FixedIncomeAsset,
  CreateFixedIncomeAsset,
  PaginatedResponse,
  UpdateFixedIncomeAsset,
} from "@/shared/types/fixedIncomeAsset";

class FixedIncomeAssetService {
  async getAssets({
    page = 1,
    itemsPerPage = 10,
    sortBy = "description",
    order = "ASC",
    skipPagination = false,
  }): Promise<PaginatedResponse<FixedIncomeAsset>> {
    const params = new URLSearchParams({
      page: String(page),
      itemsPerPage: String(itemsPerPage),
      sortBy,
      order,
      ...(skipPagination && { skipPagination: "true" }),
    });

    const requestUrl = `${API_ENDPOINTS.fixedIncomeAssets.list}?${params.toString()}`;
    const response =
      await api.get<PaginatedResponse<FixedIncomeAsset>>(requestUrl);

    return response.data;
  }

  async createAsset(data: CreateFixedIncomeAsset): Promise<FixedIncomeAsset> {
    const url = API_ENDPOINTS.fixedIncomeAssets.create;
    const response = await api.post<FixedIncomeAsset>(url, data);
    return response.data;
  }

  async updateAsset(
    id: number,
    data: UpdateFixedIncomeAsset,
  ): Promise<FixedIncomeAsset> {
    const url = API_ENDPOINTS.fixedIncomeAssets.update.replace(
      ":id",
      id.toString(),
    );
    const response = await api.put<FixedIncomeAsset>(url, data);
    return response.data;
  }

  async deleteAsset(id: number): Promise<void> {
    const url = API_ENDPOINTS.fixedIncomeAssets.delete.replace(
      ":id",
      id.toString(),
    );
    await api.delete<void>(url);
  }

  // async exportCsv(): Promise<Blob> {
  //   const response = await api.get<Blob>(API_ENDPOINTS.fixedIncomeAssets.export, {
  //     responseType: "blob",
  //   });
  //   return response.data;
  // }

  // async refreshMarketPrices(): Promise<{
  //   updated: number;
  //   failed: number;
  //   failedTickers: string[];
  // }> {
  //   const response = await api.get<{
  //     updated: number;
  //     failed: number;
  //     failedTickers: string[];
  //   }>(API_ENDPOINTS.fixedIncomeAssets.refreshMarketPrices);
  //   return response.data;
  // }
}

export const fixedIncomeAssetService = new FixedIncomeAssetService();
