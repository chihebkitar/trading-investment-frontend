// src/app/services/commodity.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commodity } from '../models/commodity.model';  // <--- import Commodity

@Injectable({
  providedIn: 'root'
})
export class CommodityService {
  private baseUrl = 'http://localhost:8080/api/commodities';

  constructor(private http: HttpClient) {}

  // Force fetch from Python and save in DB
  fetchCommodity(symbol: string): Observable<Commodity> {
    return this.http.post<Commodity>(`${this.baseUrl}/fetch`, { symbol });
  }

  // Retrieve commodity from DB if exists, or fetch if missing
  getCommodity(symbol: string): Observable<Commodity> {
    return this.http.get<Commodity>(`${this.baseUrl}/${symbol}`);
  }

  // Search by substring. If not found, it might auto-fetch in the back end
  searchCommodities(query: string): Observable<Commodity[]> {
    return this.http.get<Commodity[]>(`${this.baseUrl}/search?q=${query}`);
  }

  // Return trending commodities (sorted by dailyChangePercent desc).
  getTrendingCommodities(): Observable<Commodity[]> {
    return this.http.get<Commodity[]>(`${this.baseUrl}/trending`);
  }

  /**
   * Retrieve historical data from the python microservice
   * if you have an endpoint like GET /commodities/{symbol}/history
   */
  getCommodityHistory(symbol: string, period?: string, start?: string, end?: string): Observable<any> {
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
