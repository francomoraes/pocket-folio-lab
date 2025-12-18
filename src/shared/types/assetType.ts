import { AssetClass } from "@/shared/types/assetClass";

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
}

export interface UpdateAssetType {
  id: number;
  name?: string;
  targetPercentage?: number;
  assetClassId?: number;
}
