import { Portfolio } from './portfolio';

export interface User {
  id?: number;
  name: string;
  balance: number;
  portfolio?: Portfolio;
}
