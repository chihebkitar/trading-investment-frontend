// src/app/models/crypto.model.ts
export interface Crypto {
    id?: number;
    symbol: string;
    name: string;
    currentPrice?: number;
    marketCap?: number;
    circulatingSupply?: number;
    coinMarketCapLink?: string;
    description?: string;
    dailyVolume?: number;
    dailyChangePercent?: number;
  }
  