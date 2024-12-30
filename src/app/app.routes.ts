import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
      {
        path: 'markets',
        loadChildren: () =>
          import('./pages/markets/markets.routes').then(
            (m) => m.MarketsRoutes
          ),
      },
    
    ],
  },
 
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
