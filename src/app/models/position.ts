// src/app/models/position.ts
export interface Position {
  id?: number;
  asset: {
    id?: number;
    symbol: string;
    name: string;
    currentPrice?: number;
    dailyVolume?: number;
    dailyChangePercent?: number;
  };
  quantity: number;
  averageCost: number;
}
