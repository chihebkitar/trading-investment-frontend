import { Routes } from '@angular/router';



import { PortfolioComponent } from './portfolio/portfolio.component';
import { StockHomeComponent } from './stock-home/stock-home.component';
import { StockDetailComponent } from './stock-detail/stock-detail.component';
import { CryptoHomeComponent } from './crypto-home/crypto-home.component';
import { CryptoDetailComponent } from './crypto-detail/crypto-detail.component';
import { ForexHomeComponent } from './forex-home/forex-home.component';
import { ForexDetailComponent } from './forex-detail/forex-detail.component';
import { CommodityHomeComponent } from './commodity-home/commodity-home.component';
import { CommodityDetailComponent } from './commodity-detail/commodity-detail.component';
export const MarketsRoutes: Routes = [
  {
    path: '',
    children: [
  
     { path: 'portfolio', component: PortfolioComponent },
     { path: 'stocks', component: StockHomeComponent },
     { path: 'stocks/:symbol', component: StockDetailComponent },
     { path: 'cryptos', component: CryptoHomeComponent },
     { path: 'cryptos/:symbol', component: CryptoDetailComponent },
     { path: 'forex', component: ForexHomeComponent },
     { path: 'forex/:symbol', component: ForexDetailComponent },
     {
      path: 'commodities',
      component: CommodityHomeComponent, // or a lazy-loaded approach
    },
    {
      path: 'commodities/:symbol',
      component: CommodityDetailComponent,
      // or loadComponent approach if in standalone modules
    },
    ],
  },
];
