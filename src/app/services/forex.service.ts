// src/app/services/forex.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Forex } from '../models/forex.model';
@Injectable({
  providedIn: 'root'
})
export class ForexService {
  private baseUrl = 'http://localhost:8080/api/forex';

  constructor(private http: HttpClient) {}

  // Force fetch from Python
  fetchForex(symbol: string): Observable<Forex> {
    return this.http.post<Forex>(`${this.baseUrl}/fetch`, { symbol });
  }

  getForex(symbol: string): Observable<Forex> {    
    return this.http.get<Forex>(`${this.baseUrl}/symbol/${symbol}`);
  }
  

  searchForex(query: string): Observable<Forex[]> {
    return this.http.get<Forex[]>(`${this.baseUrl}/search?q=${query}`);
  }

  getTrendingForex(): Observable<Forex[]> {
    return this.http.get<Forex[]>(`${this.baseUrl}/trending`);
  }

  // If you added the /history endpoint:
  getForexHistory(symbol: string, period?: string, start?: string, end?: string): Observable<any> {
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
