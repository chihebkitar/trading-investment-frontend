import { Routes } from '@angular/router';
import { BlankComponent } from './components/blank/blank.component';
import { FullComponent } from './components/full/full.component';
import { StarterComponent } from './components/starter/starter.component';
import { AppSideLoginComponent } from './components/authentication/side-login.component';

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
        component: StarterComponent,
        data: {
          title: 'Starter',
          urls: [
            { title: 'Dashboard', url: '/dashboard' },
            { title: 'Starter' },
          ],
        },
      },
    ],
  },
  {
    path: 'authentication',
    component: BlankComponent,
    children: [
      {
        path: 'login',
        component: AppSideLoginComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'authentication/login',
  },
];
