import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";
import {
  Asset,
  CreateAssetRequest,
  PaginatedResponse,
  UpdateAssetRequest,
} from "@/shared/types/asset";

class AssetService {
  async getAssets({
    page = 1,
    itemsPerPage = 10,
    sortBy = "ticker",
    order = "ASC",
    skipPagination = false,
  }): Promise<PaginatedResponse<Asset>> {
    const params = new URLSearchParams({
      page: String(page),
      itemsPerPage: String(itemsPerPage),
      sortBy,
      order,
      ...(skipPagination && { skipPagination: "true" }),
    });

    const requestUrl = `${API_ENDPOINTS.assets.list}?${params.toString()}`;
    const response = await api.get<PaginatedResponse<Asset>>(requestUrl);

    return response.data;
  }

  async createAsset(data: CreateAssetRequest): Promise<Asset> {
    console.log({ data });
    const response = await api.post<Asset>(API_ENDPOINTS.assets.create, data);
    console.log({ response });
    return response.data;
  }

  async updateAsset(id: number, data: UpdateAssetRequest): Promise<Asset> {
    const url = API_ENDPOINTS.assets.update.replace(":id", id.toString());
    const response = await api.put<Asset>(url, data);
    return response.data;
  }

  async deleteAsset(id: number): Promise<void> {
    const url = API_ENDPOINTS.assets.delete.replace(":id", id.toString());
    await api.delete<void>(url);
  }

  async exportCsv(): Promise<Blob> {
    const response = await api.get<Blob>(API_ENDPOINTS.assets.export, {
      responseType: "blob",
    });
    return response.data;
  }

  async refreshMarketPrices(): Promise<{
    updated: number;
    failed: number;
    failedTickers: string[];
  }> {
    const response = await api.get<{
      updated: number;
      failed: number;
      failedTickers: string[];
    }>(API_ENDPOINTS.assets.refreshMarketPrices);
    return response.data;
  }
}

export const assetService = new AssetService();
