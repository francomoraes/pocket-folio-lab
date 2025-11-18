import { AssetClass } from "@/types/assetClass";

export interface AssetType {
  id: number;
  name: string;
  targetPercentage: number;
  assetClassId: number;
  userId: number;
  assetClass?: AssetClass;
}

export interface CreateAssetType {
  name: string;
  targetPercentage: number;
  assetClassId: number;
  userId: number;
}

export interface UpdateAssetType {
  id: string;
  name?: string;
  targetPercentage?: number;
}
