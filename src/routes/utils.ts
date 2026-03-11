import {
  Dashboard,
  LocalShipping,
  Payment,
  Store,
  Category,
  Inventory2,
  Policy,
  Settings,
  Notifications,
  People,
  Description,
} from '@mui/icons-material';

import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

export interface RouteLinkItem {
  name: string;
  path: string;
  Icon: any;
}

export interface RouteLinkGroup {
  section: string;
  links: RouteLinkItem[];
}

export const RouteLinks: RouteLinkGroup[] = [
  // ---------------- DASHBOARD ----------------
  {
    section: 'Dashboard',
    links: [{ name: 'Dashboard', path: '/', Icon: Dashboard }],
  },

  // ---------------- GOODS (Catalog) ----------------
  {
    section: 'Goods',
    links: [
      { name: 'Category', path: '/categories', Icon: Category },
      { name: 'SubCategory', path: '/subcategories', Icon: Category },
      { name: 'Product', path: '/products', Icon: Inventory2 },
      { name: '% Discount', path: '/discount', Icon: Payment },
    ],
  },

  // ---------------- PAYMENTS ----------------
  {
    section: 'Payments',
    links: [
      { name: 'AUPay', path: '/payments-aupay', Icon: CreditCardIcon },
      { name: 'PhonePe', path: '/payments-phonepe', Icon: AccountBalanceWalletIcon },
      { name: 'COD', path: '/payments-cod', Icon: LocalAtmIcon },
    ],
  },

  // ---------------- STORE ----------------
  {
    section: 'Store',
    links: [
      { name: 'Store', path: '/store', Icon: Store },
      { name: 'Store Type', path: '/store-type', Icon: Category },
    ],
  },

  // ---------------- DELIVERY ----------------
  {
    section: 'Delivery',
    links: [
      { name: 'Delivery', path: '/delivery', Icon: LocalShipping },
      { name: 'Delivery Setup', path: '/delivery_setup', Icon: Settings },
    ],
  },

  // ---------------- POLICY ----------------
  {
    section: 'Policy',
    links: [
      { name: 'Privacy Policy', path: '/privacy-policy', Icon: Policy },
      { name: 'Returns & Refunds', path: '/returns&refunds', Icon: Description },
      { name: 'Terms & Conditions', path: '/terms&conditions', Icon: Description },
    ],
  },

  // ---------------- APP ----------------
  {
    section: 'App',
    links: [
      { name: 'Logs', path: '/logs', Icon: Description },
      { name: 'Users', path: '/users', Icon: People },
      { name: 'Settings', path: '/settings', Icon: Settings },
      { name: 'Notification', path: 'notifications', Icon: Notifications },
    ],
  },
];
