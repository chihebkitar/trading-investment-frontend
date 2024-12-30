// src/app/models/asset.ts
export interface Asset {
  id?: number;
  symbol: string;
  name: string;
  currentPrice?: number;
  dailyVolume?: number;
  dailyChangePercent?: number;
}
