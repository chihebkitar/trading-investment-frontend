import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
  {
    displayName: 'Dashboard',
    iconName: 'solar:widget-add-line-duotone',
    route: '/dashboard',
  },
  {
    navCap: 'Markets',
    divider: true
  },
  {
    displayName: 'stocks',
    iconName: 'solar:archive-minimalistic-line-duotone',
    route: '/markets/stocks',
  },
  {
    displayName: 'crypto',
    iconName: 'solar:chat-round-money-broken',
    route: '/markets/cryptos',
  },
  {
    displayName: 'forex',
    iconName: 'solar:euro-outline',
    route: '/markets/forex',
  },
  {
    displayName: 'Commodities',
    iconName: 'solar:safe-square-outline',
    route: '/markets/commodities',
  },
  {
    displayName: 'portfolio',
    iconName: 'solar:chat-round-money-broken',
    route: '/markets/portfolio',
  },
 
  
  
  
];
