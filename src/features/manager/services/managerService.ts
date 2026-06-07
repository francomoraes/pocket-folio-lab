import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";
import {
  AvailableManager,
  ManagerClient,
  ManagerDashboard,
  PaginationMeta,
  ClientAssetTypeTarget,
} from "@/shared/types/manager";
import { SummaryData, SummaryResponse } from "@/shared/types/summary";
import { WealthHistory } from "@/shared/types/wealthHistory";
import { Asset } from "@/shared/types/asset";
import { FixedIncomeAsset } from "@/shared/types/fixedIncomeAsset";

class ManagerService {
  async getAvailableManagers(params: {
    search?: string;
    page?: number;
    itemsPerPage?: number;
  }): Promise<{ data: AvailableManager[]; meta: PaginationMeta }> {
    const response = await api.get<{
      data: AvailableManager[];
      meta: PaginationMeta;
    }>(API_ENDPOINTS.managers.list, { params });
    return response.data;
  }

  async getDashboard(): Promise<ManagerDashboard> {
    const response = await api.get<ManagerDashboard>(
      API_ENDPOINTS.managers.dashboard,
    );
    return response.data;
  }

  async getMyClients(params: {
    search?: string;
    page?: number;
    itemsPerPage?: number;
    sortBy?: string;
    order?: string;
  }): Promise<{ data: ManagerClient[]; meta: PaginationMeta }> {
    const response = await api.get<{
      data: ManagerClient[];
      meta: PaginationMeta;
    }>(API_ENDPOINTS.managers.clients, { params });
    return response.data;
  }

  async getClientSummary(investorId: number): Promise<SummaryResponse> {
    const response = await api.get<SummaryResponse>(
      API_ENDPOINTS.managers.clientSummary(investorId),
    );
    return response.data;
  }

  async getClientAssets(
    investorId: number,
    params?: { page?: number; itemsPerPage?: number },
  ): Promise<{ data: Asset[]; meta: PaginationMeta }> {
    const response = await api.get<{ data: Asset[]; meta: PaginationMeta }>(
      API_ENDPOINTS.managers.clientAssets(investorId),
      { params },
    );
    return response.data;
  }

  async getClientFixedIncomeAssets(
    investorId: number,
    params?: { page?: number; itemsPerPage?: number },
  ): Promise<{ data: FixedIncomeAsset[]; meta: PaginationMeta }> {
    const response = await api.get<{
      data: FixedIncomeAsset[];
      meta: PaginationMeta;
    }>(API_ENDPOINTS.managers.clientFixedIncome(investorId), { params });
    return response.data;
  }

  async getClientWealthHistory(investorId: number): Promise<WealthHistory[]> {
    const response = await api.get<WealthHistory[]>(
      API_ENDPOINTS.managers.clientWealthHistory(investorId),
    );
    return response.data;
  }

  async getClientProfile(investorId: number): Promise<{
    user: { id: number; name: string; email: string; locale: string | null; profilePictureUrl: string | null };
    assetTypes: ClientAssetTypeTarget[];
  }> {
    const response = await api.get<{
      user: { id: number; name: string; email: string; locale: string | null; profilePictureUrl: string | null };
      assetTypes: ClientAssetTypeTarget[];
    }>(API_ENDPOINTS.managers.clientProfile(investorId));
    return response.data;
  }

  async updateClientAssetTypeTargetPercentage(
    investorId: number,
    assetTypeId: number,
    targetPercentage: number,
  ): Promise<void> {
    await api.patch(
      API_ENDPOINTS.managers.clientAssetTypeTargetPercentage(
        investorId,
        assetTypeId,
      ),
      { targetPercentage },
    );
  }
}

export const managerService = new ManagerService();
