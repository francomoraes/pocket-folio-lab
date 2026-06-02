import { AssetType } from "@/shared/types/assetType";
import { Institution } from "@/shared/types/institution";

export enum IndexationMode {
  PRE = "PRE",
  CDI = "CDI",
  IPCA = "IPCA",
  SELIC = "SELIC",
}

export interface FixedIncomeAsset {
  id: number;
  userId: number;
  type: AssetType;
  description: string;
  manualMode: boolean;
  startDate: Date;
  maturityDate: Date;
  indexationMode: IndexationMode;
  interestRate: number;
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

export interface CreateFixedIncomeAsset {
  description: string;
  manualMode?: boolean;
  startDate?: string;
  maturityDate?: string;
  indexationMode?: IndexationMode;
  interestRate?: number;
  investedValueCents: number;
  currentValueCents?: number;
  institutionId: number;
  typeId: number;
  currency: string;
}

export interface UpdateFixedIncomeAsset {
  id?: number;
  description?: string;
  manualMode?: boolean;
  startDate?: string;
  maturityDate?: string;
  indexationMode?: IndexationMode;
  interestRate?: number;
  investedValueCents?: number;
  currentValueCents?: number;
  institutionId?: number;
  typeId?: number;
  currency?: string;
}

export interface DeleteFixedIncomeAsset {
  id: number;
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
