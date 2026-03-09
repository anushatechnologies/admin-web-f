import { JSX } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  status: 'Pending' | 'Completed' | 'Failed';
}

export interface RevenueCard {
  title: string;
  value: number;
  icon?: JSX.Element;
}
