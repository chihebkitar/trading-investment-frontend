// src/app/services/shared.service.ts
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  // Subject to emit refresh events
  private refreshPortfolioSource = new Subject<void>();

  // Observable for components to subscribe to
  refreshPortfolio$ = this.refreshPortfolioSource.asObservable();

  /**
   * Call this method to trigger a portfolio refresh
   */
  triggerRefresh() {
    this.refreshPortfolioSource.next();
  }
}
