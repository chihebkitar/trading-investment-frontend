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
    displayName: 'Assets',
    iconName: 'solar:archive-minimalistic-line-duotone',
    route: '/markets/assets',
  },
  {
    displayName: 'portfolio',
    iconName: 'solar:chat-round-money-broken',
    route: '/markets/portfolio',
  },
  {
    displayName: 'stocks',
    iconName: 'solar:euro-outline',
    route: '/markets/stocks',
  },
  {
    displayName: 'Commodities',
    iconName: 'solar:safe-square-outline',
    route: '/markets/commodity',
  },
 
  
  
  
];
