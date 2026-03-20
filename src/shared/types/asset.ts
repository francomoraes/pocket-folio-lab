import { AssetType } from "@/shared/types/assetType";
import { Institution } from "@/shared/types/institution";

export interface Asset {
  id: number;
  userId: number;
  type: AssetType;
  ticker: string;
  quantity: number;
  averagePriceCents: number;
  currentPriceCents: number;
  investedValueCents: number;
  currentValueCents: number;
  resultCents: number;
  returnPercentage: number;
  portfolioPercentage: number;
  institution: Institution;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAssetRequest {
  ticker: string;
  quantity: number;
  averagePriceCents: number;
  type: string;
  institutionId: number;
  currency: string;
}

export interface UpdateAssetRequest {
  type?: string;
  ticker?: string;
  quantity?: number;
  averagePriceCents?: number;
  institutionId?: number;
  currency?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
