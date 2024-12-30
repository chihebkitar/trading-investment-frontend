// src/app/services/order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TradeOrder } from '../models/trade-order';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

 // order.service.ts
placeOrder(
  userId: number,
  symbol: string,
  orderType: string,   // "BUY" or "SELL"
  quantity?: number,
  amount?: number
): Observable<TradeOrder> {
  const body = { userId, symbol, orderType, quantity, amount };
  return this.http.post<TradeOrder>(`${this.baseUrl}/place`, body);
}

}
