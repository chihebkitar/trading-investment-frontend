import { Routes } from '@angular/router';



import { PortfolioComponent } from './portfolio/portfolio.component';
import { StockHomeComponent } from './stock-home/stock-home.component';
import { StockDetailComponent } from './stock-detail/stock-detail.component';

export const MarketsRoutes: Routes = [
  {
    path: '',
    children: [
  
     { path: 'portfolio', component: PortfolioComponent },
     { path: 'stocks', component: StockHomeComponent },
     { path: 'stocks/:symbol', component: StockDetailComponent },

     
    ],
  },
];
