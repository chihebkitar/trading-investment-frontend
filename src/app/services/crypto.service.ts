// src/app/services/crypto.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Crypto } from '../models/crypto.model'; // Create a `crypto.model.ts` similar to `stock.model.ts`

@Injectable({
  providedIn: 'root'
})
export class CryptoService {
  private baseUrl = 'http://localhost:8080/api/cryptos';

  constructor(private http: HttpClient) {}

  // Force fetch from Python
  fetchCrypto(symbol: string): Observable<Crypto> {
    return this.http.post<Crypto>(`${this.baseUrl}/fetch`, { symbol });
  }

  getCrypto(symbol: string): Observable<Crypto> {
    return this.http.get<Crypto>(`${this.baseUrl}/${symbol}`);
  }

  searchCryptos(query: string): Observable<Crypto[]> {
    return this.http.get<Crypto[]>(`${this.baseUrl}/search?q=${query}`);
  }

  getTrendingCryptos(): Observable<Crypto[]> {
    return this.http.get<Crypto[]>(`${this.baseUrl}/trending`);
  }

  // If you added the /history endpoint in the backend:
  getCryptoHistory(symbol: string, period?: string, start?: string, end?: string): Observable<any> {
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
