import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";
import { AssetType } from "@/types/assetType";

class AssetTypeService {
  async list(): Promise<AssetType[]> {
    const response = await api.get<AssetType[]>(API_ENDPOINTS.assetTypes.list);
    return response.data;
  }

  async getById(id: number): Promise<AssetType> {
    const url = API_ENDPOINTS.assetTypes.get.replace(":id", id.toString());
    const response = await api.get<AssetType>(url);
    return response.data;
  }

  async create(
    data: Omit<AssetType, "id" | "createdAt" | "updatedAt">,
  ): Promise<AssetType> {
    const response = await api.post<AssetType>(
      API_ENDPOINTS.assetTypes.create,
      data,
    );
    return response.data;
  }

  async update(
    id: number,
    data: Partial<Omit<AssetType, "id" | "createdAt" | "updatedAt">>,
  ): Promise<AssetType> {
    const url = API_ENDPOINTS.assetTypes.update.replace(":id", id.toString());
    const response = await api.put<AssetType>(url, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    const url = API_ENDPOINTS.assetTypes.delete.replace(":id", id.toString());
    await api.delete<void>(url);
  }
}

export const assetTypeService = new AssetTypeService();
