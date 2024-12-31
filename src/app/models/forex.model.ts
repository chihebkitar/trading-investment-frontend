// src/app/models/forex.model.ts
export interface Forex {
    id?: number;
    symbol: string;
    name: string;          // e.g. "EUR/USD"
    currentPrice?: number; // The price in USD for 1 unit of the base currency
    currency?: string;     // typically "USD"
    dayHigh?: number;
    dayLow?: number;
    dailyVolume?: number;
    dailyChangePercent?: number;
  }
  