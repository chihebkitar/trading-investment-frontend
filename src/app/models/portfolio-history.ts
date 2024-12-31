// src/app/models/portfolio-history.ts
import { Portfolio } from './portfolio';

export interface PortfolioHistory {
  id?: number;
  dateTime: string;          // e.g., "2024-12-20T21:51:56.834695"
  totalValue: number;        // e.g., 105000
  portfolio: Portfolio;      // Include the portfolio with positions
}
