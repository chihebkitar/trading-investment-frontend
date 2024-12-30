// src/app/models/trade-order.ts
import { Asset } from './asset'; // or Stock, if your back end returns a Stock for the 'asset' field

export interface TradeOrder {
  id?: number;
  userId: number;         // the user placing order
  asset?: Asset;          // the back end might return the parent Asset 
  orderType: string;      // "BUY" or "SELL"
  quantity: number;       
  price: number;
  totalAmount: number;
  investedAmount?: number;
  orderDate?: string;
  status?: string;        // e.g. "FILLED"
}
