// src/app/models/stock.model.ts
export interface Stock {
  id?: number;
  symbol: string;
  name: string;
  currentPrice?: number;
  marketCap?: number;
  dividendRate?: number;
  sector?: string;
  industry?: string;
  dailyVolume?: number;
  dailyChangePercent?: number;
  // e.g. rsi14?: number; ...
}
