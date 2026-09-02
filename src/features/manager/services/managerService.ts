import { API_ENDPOINTS } from "@/config/api";
import { api } from "@/lib/axios";
import {
  AvailableManager,
  ClientScope,
  ClientSortBy,
  ManagerClientsResponse,
  ManagerDashboard,
  PaginationMeta,
  ClientAssetTypeTarget,
  RiskProfile,
  ManagerHistoryCycle,
} from "@/shared/types/manager";
import { SummaryData, SummaryResponse } from "@/shared/types/summary";
import {
  CreateWealthHistoryRequest,
  UpdateWealthHistoryRequest,
  WealthHistory,
} from "@/shared/types/wealthHistory";
import {
  Asset,
  CreateAssetRequest,
  PaginatedResponse,
  UpdateAssetRequest,
} from "@/shared/types/asset";
import {
  CreateFixedIncomeAsset,
  FixedIncomeAsset,
  PaginatedResponse as FixedIncomePaginatedResponse,
  UpdateFixedIncomeAsset,
} from "@/shared/types/fixedIncomeAsset";
import { PaginationQuery } from "@/shared/types/pagination";
import {
  AssetType,
  CreateAssetType,
  UpdateAssetType,
} from "@/shared/types/assetType";
import {
  AssetClass,
  CreateAssetClass,
  UpdateAssetClass,
} from "@/shared/types/assetClass";
import {
  CreateInstitution,
  Institution,
  UpdateInstitution,
} from "@/shared/types/institution";
import {
  AssetTransaction,
  AssetTransactionListParams,
  CreateAssetTransactionRequest,
  UpdateAssetTransactionRequest,
} from "@/shared/types/assetTransaction";
import {
  OperationLogAction,
  OperationLogListResponse,
} from "@/shared/types/operationLog";

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

  async getDashboard(params?: { scope?: ClientScope }): Promise<ManagerDashboard> {
    const response = await api.get<ManagerDashboard>(
      API_ENDPOINTS.managers.dashboard,
      { params },
    );
    return response.data;
  }

  async getMyClients(params: {
    search?: string;
    page?: number;
    itemsPerPage?: number;
    sortBy?: ClientSortBy;
    order?: string;
    scope?: ClientScope;
    activeOnly?: boolean;
  }): Promise<ManagerClientsResponse> {
    const response = await api.get<ManagerClientsResponse>(
      API_ENDPOINTS.managers.clients,
      { params },
    );
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
    params?: PaginationQuery,
  ): Promise<PaginatedResponse<Asset>> {
    const response = await api.get<PaginatedResponse<Asset>>(
      API_ENDPOINTS.managers.clientAssets.list(investorId),
      { params },
    );
    return response.data;
  }

  async createClientAsset(
    investorId: number,
    data: CreateAssetRequest,
  ): Promise<Asset> {
    const response = await api.post<Asset>(
      API_ENDPOINTS.managers.clientAssets.create(investorId),
      data,
    );
    return response.data;
  }

  async updateClientAsset(
    investorId: number,
    id: number,
    data: UpdateAssetRequest,
  ): Promise<Asset> {
    const response = await api.put<Asset>(
      API_ENDPOINTS.managers.clientAssets.update(investorId, id),
      data,
    );
    return response.data;
  }

  async deleteClientAsset(investorId: number, id: number): Promise<void> {
    await api.delete<void>(
      API_ENDPOINTS.managers.clientAssets.delete(investorId, id),
    );
  }

  async retryClientAssetPrice(
    investorId: number,
    id: number,
  ): Promise<{ message: string; asset: Asset }> {
    const response = await api.post<{ message: string; asset: Asset }>(
      API_ENDPOINTS.managers.clientAssets.retryPrice(investorId, id),
    );
    return response.data;
  }

  async refreshClientMarketPrices(investorId: number): Promise<{
    message: string;
    updated: number;
    failed: number;
    failedTickers: string[];
    usedCacheOnly: boolean;
    cooldownHours: number;
    nextYahooCallAt: string | null;
  }> {
    const response = await api.get<{
      message: string;
      updated: number;
      failed: number;
      failedTickers: string[];
      usedCacheOnly: boolean;
      cooldownHours: number;
      nextYahooCallAt: string | null;
    }>(API_ENDPOINTS.managers.clientAssets.refreshMarketPrices(investorId));
    return response.data;
  }

  async getClientTransactions(
    investorId: number,
    params: AssetTransactionListParams = {},
  ): Promise<PaginatedResponse<AssetTransaction>> {
    const response = await api.get<PaginatedResponse<AssetTransaction>>(
      API_ENDPOINTS.managers.clientAssetTransactions.list(investorId),
      { params },
    );
    return response.data;
  }

  async createClientTransaction(
    investorId: number,
    data: CreateAssetTransactionRequest,
  ): Promise<AssetTransaction> {
    const response = await api.post<{ transaction: AssetTransaction }>(
      API_ENDPOINTS.managers.clientAssetTransactions.create(investorId),
      data,
    );
    return response.data.transaction;
  }

  async updateClientTransaction(
    investorId: number,
    transactionId: number,
    data: UpdateAssetTransactionRequest,
  ): Promise<AssetTransaction> {
    const response = await api.put<{ transaction: AssetTransaction }>(
      API_ENDPOINTS.managers.clientAssetTransactions.update(
        investorId,
        transactionId,
      ),
      data,
    );
    return response.data.transaction;
  }

  async deleteClientTransaction(
    investorId: number,
    transactionId: number,
  ): Promise<void> {
    await api.delete<void>(
      API_ENDPOINTS.managers.clientAssetTransactions.delete(
        investorId,
        transactionId,
      ),
    );
  }

  async getClientFixedIncomeAssets(
    investorId: number,
    params?: PaginationQuery,
  ): Promise<FixedIncomePaginatedResponse<FixedIncomeAsset>> {
    const response = await api.get<
      FixedIncomePaginatedResponse<FixedIncomeAsset>
    >(API_ENDPOINTS.managers.clientFixedIncome.list(investorId), { params });
    return response.data;
  }

  async createClientFixedIncomeAsset(
    investorId: number,
    data: CreateFixedIncomeAsset,
  ): Promise<FixedIncomeAsset> {
    const response = await api.post<FixedIncomeAsset>(
      API_ENDPOINTS.managers.clientFixedIncome.create(investorId),
      data,
    );
    return response.data;
  }

  async updateClientFixedIncomeAsset(
    investorId: number,
    id: number,
    data: UpdateFixedIncomeAsset,
  ): Promise<FixedIncomeAsset> {
    const response = await api.put<FixedIncomeAsset>(
      API_ENDPOINTS.managers.clientFixedIncome.update(investorId, id),
      data,
    );
    return response.data;
  }

  async deleteClientFixedIncomeAsset(
    investorId: number,
    id: number,
  ): Promise<void> {
    await api.delete<void>(
      API_ENDPOINTS.managers.clientFixedIncome.delete(investorId, id),
    );
  }

  async listClientAssetTypes(investorId: number): Promise<AssetType[]> {
    const response = await api.get<AssetType[]>(
      API_ENDPOINTS.managers.clientAssetTypes.list(investorId),
    );
    return response.data;
  }

  async createClientAssetType(
    investorId: number,
    data: CreateAssetType,
  ): Promise<AssetType> {
    const response = await api.post<AssetType>(
      API_ENDPOINTS.managers.clientAssetTypes.create(investorId),
      data,
    );
    return response.data;
  }

  async updateClientAssetType(
    investorId: number,
    id: number,
    data: UpdateAssetType,
  ): Promise<AssetType> {
    const response = await api.patch<AssetType>(
      API_ENDPOINTS.managers.clientAssetTypes.update(investorId, id),
      data,
    );
    return response.data;
  }

  async deleteClientAssetType(investorId: number, id: number): Promise<void> {
    await api.delete<void>(
      API_ENDPOINTS.managers.clientAssetTypes.delete(investorId, id),
    );
  }

  async listClientAssetClasses(investorId: number): Promise<AssetClass[]> {
    const response = await api.get<AssetClass[]>(
      API_ENDPOINTS.managers.clientAssetClasses.list(investorId),
    );
    return response.data;
  }

  async createClientAssetClass(
    investorId: number,
    data: CreateAssetClass,
  ): Promise<AssetClass> {
    const response = await api.post<AssetClass>(
      API_ENDPOINTS.managers.clientAssetClasses.create(investorId),
      data,
    );
    return response.data;
  }

  async updateClientAssetClass(
    investorId: number,
    id: number,
    data: Partial<CreateAssetClass>,
  ): Promise<AssetClass> {
    const response = await api.patch<AssetClass>(
      API_ENDPOINTS.managers.clientAssetClasses.update(investorId, id),
      data,
    );
    return response.data;
  }

  async deleteClientAssetClass(
    investorId: number,
    id: number,
  ): Promise<void> {
    await api.delete<void>(
      API_ENDPOINTS.managers.clientAssetClasses.delete(investorId, id),
    );
  }

  async listClientInstitutions(investorId: number): Promise<Institution[]> {
    const response = await api.get<Institution[]>(
      API_ENDPOINTS.managers.clientInstitutions.list(investorId),
    );
    return response.data;
  }

  async createClientInstitution(
    investorId: number,
    data: CreateInstitution,
  ): Promise<Institution> {
    const response = await api.post<Institution>(
      API_ENDPOINTS.managers.clientInstitutions.create(investorId),
      data,
    );
    return response.data;
  }

  async updateClientInstitution(
    investorId: number,
    id: number,
    data: Partial<CreateInstitution>,
  ): Promise<Institution> {
    const response = await api.patch<Institution>(
      API_ENDPOINTS.managers.clientInstitutions.update(investorId, id),
      data,
    );
    return response.data;
  }

  async deleteClientInstitution(
    investorId: number,
    id: number,
  ): Promise<void> {
    await api.delete<void>(
      API_ENDPOINTS.managers.clientInstitutions.delete(investorId, id),
    );
  }

  async getClientWealthHistory(investorId: number): Promise<WealthHistory[]> {
    const response = await api.get<WealthHistory[]>(
      API_ENDPOINTS.managers.clientWealthHistory.list(investorId),
    );
    return response.data;
  }

  async createClientWealthHistory(
    investorId: number,
    data: CreateWealthHistoryRequest,
  ): Promise<WealthHistory> {
    const response = await api.post<WealthHistory>(
      API_ENDPOINTS.managers.clientWealthHistory.create(investorId),
      data,
    );
    return response.data;
  }

  async updateClientWealthHistory(
    investorId: number,
    id: number,
    data: UpdateWealthHistoryRequest,
  ): Promise<WealthHistory> {
    const response = await api.put<WealthHistory>(
      API_ENDPOINTS.managers.clientWealthHistory.update(investorId, id),
      data,
    );
    return response.data;
  }

  async deleteClientWealthHistory(
    investorId: number,
    id: number,
  ): Promise<void> {
    await api.delete<void>(
      API_ENDPOINTS.managers.clientWealthHistory.delete(investorId, id),
    );
  }

  async getClientProfile(investorId: number): Promise<{
    user: {
      id: number;
      name: string;
      email: string;
      locale: string | null;
      profilePictureUrl: string | null;
      selfServiceEnabled: boolean;
      riskProfile: RiskProfile | null;
      riskProfileUpdatedAt: string | null;
    };
    assetTypes: ClientAssetTypeTarget[];
  }> {
    const response = await api.get<{
      user: {
        id: number;
        name: string;
        email: string;
        locale: string | null;
        profilePictureUrl: string | null;
        selfServiceEnabled: boolean;
        riskProfile: RiskProfile | null;
        riskProfileUpdatedAt: string | null;
      };
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

  async updateClientAutonomy(
    investorId: number,
    enabled: boolean,
  ): Promise<{ user: { id: number; selfServiceEnabled: boolean } }> {
    const response = await api.patch<{
      user: { id: number; selfServiceEnabled: boolean };
    }>(API_ENDPOINTS.managers.clientAutonomy(investorId), { enabled });
    return response.data;
  }

  async updateClientRiskProfile(
    investorId: number,
    riskProfile: RiskProfile,
  ): Promise<{
    user: { id: number; riskProfile: RiskProfile; riskProfileUpdatedAt: string };
  }> {
    const response = await api.patch<{
      user: { id: number; riskProfile: RiskProfile; riskProfileUpdatedAt: string };
    }>(API_ENDPOINTS.managers.clientRiskProfile(investorId), { riskProfile });
    return response.data;
  }

  async getClientOperationLogs(
    investorId: number,
    params?: { page?: number; itemsPerPage?: number; action?: OperationLogAction },
  ): Promise<OperationLogListResponse> {
    const response = await api.get<OperationLogListResponse>(
      API_ENDPOINTS.managers.clientOperationLogs(investorId),
      { params },
    );
    return response.data;
  }

  async getClientLinkHistory(investorId: number): Promise<ManagerHistoryCycle[]> {
    const response = await api.get<{ data: ManagerHistoryCycle[] }>(
      API_ENDPOINTS.managers.clientLinkHistory(investorId),
    );
    return response.data.data;
  }
}

export const managerService = new ManagerService();
