// src/app/models/portfolio.ts
import { Position } from './position';
import { User } from './user';

export interface Portfolio {
  id?: number;
  user: User;
  positions: Position[];
  totalValue: number;
}
