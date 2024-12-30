import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Portfolio } from '../models/portfolio';
import { Observable } from 'rxjs';
import { PortfolioHistory } from '../models/portfolio-history';

@Injectable({
  providedIn: 'root' // This line makes the service globally available
})
export class PortfolioService {
  private baseUrl = 'http://localhost:8080/api/portfolio';

  constructor(private http: HttpClient) {}

  getPortfolioByUser(userId: number): Observable<Portfolio> {
    return this.http.get<Portfolio>(`${this.baseUrl}/user/${userId}`);
  }

  updatePortfolioValue(userId: number): Observable<number> {
    return this.http.put<number>(`${this.baseUrl}/update/value/${userId}`, {});
  }
    /**
   * Retrieve the daily snapshots for a given portfolioId.
   */
   // portfolio.service.ts
getPortfolioHistory(portfolioId: number, resolution?: string): Observable<PortfolioHistory[]> {
  let url = `${this.baseUrl}/${portfolioId}/history`;
  if (resolution) {
    url += `?resolution=${resolution}`;
  }
  return this.http.get<PortfolioHistory[]>(url);
}

}
