// src/app/services/stock.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Stock } from '../models/stock.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  private baseUrl = 'http://localhost:8080/api/stocks';

  constructor(private http: HttpClient) {}

  // If you want to force fetch from Python:
  fetchStock(symbol: string): Observable<Stock> {
    return this.http.post<Stock>(`${this.baseUrl}/fetch`, { symbol });
  }

  getStock(symbol: string): Observable<Stock> {
    return this.http.get<Stock>(`${this.baseUrl}/${symbol}`);
  }

  searchStocks(query: string): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.baseUrl}/search?q=${query}`);
  }

  getTrendingStocks(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.baseUrl}/trending`);
  }

  getStockHistory(symbol: string, period?: string, start?: string, end?: string): Observable<any> {
    let url = `${this.baseUrl}/${symbol}/history?`;
    if (period) {
      url += `period=${period}&`;
    }
    if (start && end) {
      url += `start=${start}&end=${end}&`;
    }
    return this.http.get<any>(url);
  }
}
