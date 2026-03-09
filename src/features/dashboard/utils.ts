import { Description, AccountBalanceWallet } from '@mui/icons-material';
import { ColumnConfig } from '@components/DataTable';
import { formatCurrencyINR, toNumber, toPercent } from '@utils/numberUtils';

export const getDashboardCardsData = (data: any = {}) => {
  if (Object.keys(data).length === 0) return [];

  const list = data?.data?.[0]?.coll_dashboard?.data;
  if (!Array.isArray(list)) return [];

  const allLoans = list.find((item: any) => item.label === 'All Loans');
  const activeLoans = list.find((item: any) => item.label === 'Active');

  const cardList = [
    {
      title: 'ALL LOANS',
      count: allLoans?.loan_count ?? 0,
      pos: allLoans?.pos_amount ?? '0',
      disbursed: allLoans?.disburse_amount ?? '0',
      gradientColor: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      accentColor: '#1976d2',
      icon: Description,
    },
    {
      title: 'ACTIVE LOANS',
      count: activeLoans?.loan_count ?? 0,
      pos: activeLoans?.pos_amount ?? '0',
      disbursed: activeLoans?.disburse_amount ?? '0',
      gradientColor: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
      accentColor: '#00897b',
      icon: AccountBalanceWallet,
    },
    {
      title: 'ACTIVE LOANS',
      count: activeLoans?.loan_count ?? 0,
      pos: activeLoans?.pos_amount ?? '0',
      disbursed: activeLoans?.disburse_amount ?? '0',
      gradientColor: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
      accentColor: '#00897b',
      icon: AccountBalanceWallet,
    },
    {
      title: 'ACTIVE LOANS',
      count: activeLoans?.loan_count ?? 0,
      pos: activeLoans?.pos_amount ?? '0',
      disbursed: activeLoans?.disburse_amount ?? '0',
      gradientColor: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
      accentColor: '#00897b',
      icon: AccountBalanceWallet,
    },
    {
      title: 'ACTIVE LOANS',
      count: activeLoans?.loan_count ?? 0,
      pos: activeLoans?.pos_amount ?? '0',
      disbursed: activeLoans?.disburse_amount ?? '0',
      gradientColor: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
      accentColor: '#00897b',
      icon: AccountBalanceWallet,
    },
  ];

  return cardList;
};

export const getPerformanceData = (data: any = {}) => {
  const list = data?.data?.[0]?.coll_dashboard?.pos_burn_out;
  if (!Array.isArray(list)) return [];

  return list.map((item: any) => ({
    lender: item.lender_short_name || 'NA',
    demand: toNumber(item.demand),
    paid: toNumber(item.paid_amount),
  }));
};

export const getCollectionRateData = (data: any = {}) => {
  const dashboard = data?.data?.[0]?.coll_dashboard;
  if (!dashboard) return [];

  const collectedAmount = toNumber(dashboard?.collected_amount);
  const pendingAmount = toNumber(dashboard?.pending_amount);

  const total = collectedAmount + pendingAmount;

  return [
    {
      name: 'Collected',
      value: total === 0 ? 0 : Number(((collectedAmount / total) * 100).toFixed(2)),
      amount: formatCurrencyINR(toNumber(collectedAmount)),
      color: '#4caf50',
    },
    {
      name: 'Pending',
      value: total === 0 ? 0 : Number(((pendingAmount / total) * 100).toFixed(2)),
      amount: formatCurrencyINR(toNumber(pendingAmount)),
      color: '#ff9800',
    },
  ];
};

export const loanPerformanceColumns: ColumnConfig[] = [
  {
    id: 1,
    label: 'Lender',
    key: 'lender',
    style: 'max-width:160px;min-width:160px;',
  },
  {
    id: 2,
    label: 'Loan Count',
    key: 'loanCount',
    style: 'max-width:120px;min-width:120px;',
  },
  {
    id: 3,
    label: 'Demand',
    key: 'demand',
    style: 'max-width:150px;min-width:150px;',
  },
  {
    id: 4,
    label: 'Loan Paid Count',
    key: 'loanPaidCount',
    style: 'max-width:130px;min-width:130px;',
  },
  {
    id: 5,
    label: 'Paid Amount',
    key: 'paidAmount',
    style: 'max-width:150px;min-width:150px;',
  },
  {
    id: 6,
    label: 'EMI Paid %',
    key: 'emiPaidPercent',
    style: 'max-width:120px;min-width:120px;',
  },
  {
    id: 7,
    label: 'Principal Run Down',
    key: 'principalRunDown',
    style: 'max-width:160px;min-width:160px;',
  },
];

// Main function: extract & convert
export const getLoanPerformanceList = (data: any) => {
  const list = data?.data?.[0]?.coll_dashboard?.pos_burn_out ?? [];

  return list.map((item: any) => ({
    lender: item.lender_short_name,
    loanCount: toNumber(item.loan_count),
    demand: formatCurrencyINR(toNumber(item.demand)),
    loanPaidCount: toNumber(item.loan_paid_count),
    paidAmount: formatCurrencyINR(toNumber(item.paid_amount)),
    emiPaidPercent: toPercent(item.emi_paid_percent),
    principalRunDown: formatCurrencyINR(toNumber(item.principal_run_down)),
    highlight: item.lender_short_name === 'Total' ? true : false,
  }));
};
