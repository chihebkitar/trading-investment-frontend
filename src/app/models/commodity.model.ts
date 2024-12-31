// src/app/models/commodity.model.ts
export interface Commodity {
    id?: number;
    symbol: string;
    name: string;
    currentPrice?: number;
    dailyVolume?: number;
    dailyChangePercent?: number;
  
    // Commodity-specific fields (optional if you want them)
    dayHigh?: number;
    dayLow?: number;
    expireDate?: number;
    openInterest?: number;
  }
  