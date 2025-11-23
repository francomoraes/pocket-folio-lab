import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";
import { AssetClass, CreateAssetClass } from "@/types/assetClass";

class AssetClassService {
  async list(): Promise<AssetClass[]> {
    const response = await api.get<AssetClass[]>(
      API_ENDPOINTS.assetClasses.list,
    );
    return response.data;
  }

  async getById(id: number): Promise<AssetClass> {
    const url = API_ENDPOINTS.assetClasses.get.replace(":id", id.toString());
    const response = await api.get<AssetClass>(url);
    return response.data;
  }

  async create(data: CreateAssetClass): Promise<AssetClass> {
    const response = await api.post<AssetClass>(
      API_ENDPOINTS.assetClasses.create,
      data,
    );
    return response.data;
  }

  async update(
    id: number,
    data: Partial<CreateAssetClass>,
  ): Promise<AssetClass> {
    const url = API_ENDPOINTS.assetClasses.update.replace(":id", id.toString());
    const response = await api.patch<AssetClass>(url, data);
    return response.data;
  }

  async delete(id: number): Promise<void> {
    const url = API_ENDPOINTS.assetClasses.delete.replace(":id", id.toString());
    await api.delete<void>(url);
  }
}

export const assetClassService = new AssetClassService();
