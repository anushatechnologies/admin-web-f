import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  Box,
  Tabs,
  Tab,
  Grid,
  Divider,
  IconButton,
  CircularProgress,
} from '@mui/material';
import ReusableTable from '../../../components/common/ReusableTable';
import { 
  useGetDashboardSummaryQuery,
  useGetActiveUsersQuery,
  useGetOrderAnalyticsQuery, 
  useGetRecentOrdersQuery 
} from '../api/dashboardApi';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Visibility } from '@mui/icons-material';

type OrderStatus = string;

interface Order {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: OrderStatus;
}

// initialOrders removed, using API data

const currency = (v: number) => `₹${v.toLocaleString()}`;

const statusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'delivered':
      return 'success';
    case 'canceled':
    case 'failed':
      return 'error';
    case 'pending':
      return 'warning';
    case 'out for delivery':
    case 'shipped':
      return 'info';
    default:
      return 'default';
  }
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  // Map tab index to period string
  const periods = ['today', 'month', 'previous'];
  const currentPeriod = periods[tab];

  const { data: summaryData, isLoading: isSummaryLoading } = useGetDashboardSummaryQuery();
  const { data: activeUsersData, isLoading: isActiveUsersLoading } = useGetActiveUsersQuery();
  const { data: analyticsData, isLoading: isAnalyticsLoading } = useGetOrderAnalyticsQuery(currentPeriod);
  const { data: recentOrders, isLoading: isOrdersLoading } = useGetRecentOrdersQuery();

  const isStatsLoading = isSummaryLoading || isActiveUsersLoading;

  const analytics = analyticsData || {
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };

  return (
    <Box sx={{ p: 4, minHeight: '100vh' }}>
      {/* Header */}
      <Typography variant="h4" fontWeight={700} mb={4}>
        Welcome To Anusha Bazaar
      </Typography>

      {/* Stats Section */}
      <Grid container spacing={4} mb={4}>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Total Orders" value={summaryData?.totalOrders || 0} loading={isStatsLoading} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Active Users" value={activeUsersData?.count || summaryData?.activeUsers || 0} live loading={isStatsLoading} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="Today's Revenue" value={summaryData?.todayRevenue || 0} money loading={isStatsLoading} />
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <StatCard title="New Customers" value={summaryData?.newCustomers || 0} loading={isStatsLoading} />
        </Grid>
      </Grid>

      {/* Analytics Section */}
      <Card sx={{ borderRadius: 3, boxShadow: 3, mb: 4 }}>
        <CardHeader
          title="Business Analytics"
          titleTypographyProps={{ fontWeight: 600 }}
          action={
            <Tabs value={tab} onChange={(_, v) => setTab(v)}>
              <Tab label="Today" />
              <Tab label="This Month" />
              <Tab label="Previous" />
            </Tabs>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={2}>
            {isAnalyticsLoading ? (
                <Box display="flex" justifyContent="center" width="100%" p={4}><CircularProgress /></Box>
            ) : (
                Object.entries(analytics).map(([k, v]) => (
                <Grid size={{ xs: 6, md: 3 }} key={k}>
                    <AnalyticsCard label={k.toUpperCase()} value={v} />
                </Grid>
                ))
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Orders Section */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardHeader
          title="Recent Orders"
          titleTypographyProps={{ fontWeight: 600 }}
          action={<Button variant="contained" onClick={() => navigate('/admin/orders')}>View All</Button>}
        />
        <Divider />
        <CardContent>
          <Box sx={{ overflowX: 'auto' }}>
<ReusableTable
              columns={[
                { header: 'Order ID', key: 'orderNumber', render: (o: any) => `#${o.orderNumber}` },
                { header: 'Customer', key: 'customerName' },
                { header: 'Date', key: 'placedAt', render: (o: any) => dayjs(o.placedAt).format('DD MMM, hh:mm A') },
                { header: 'Amount', key: 'grandTotal', render: (o: any) => currency(o.grandTotal) },
                {
                  header: 'Status',
                  key: 'orderStatus',
                  render: (o: any) => (
                    <Chip label={o.orderStatus?.toUpperCase()} color={statusColor(o.orderStatus)} size="small" />
                  ),
                },
                {
                    header: 'Actions',
                    key: 'actions',
                    render: (o: any) => (
                        <IconButton 
                            color="info" 
                            size="small" 
                            onClick={() => navigate(`/admin/orders/${o.id}`)}
                        >
                            <Visibility fontSize="small" />
                        </IconButton>
                    )
                }
              ]}
              data={recentOrders || []}
              loading={isOrdersLoading}
              currentPage={1}
              totalPages={1}
              onPageChange={() => {}}
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

/* ---------- Components ---------- */

function StatCard({
  title,
  value,
  live = false,
  money = false,
  loading = false,
}: {
  title: string;
  value: number;
  live?: boolean;
  money?: boolean;
  loading?: boolean;
}) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
          {loading ? (
              <CircularProgress size={20} />
          ) : (
            <Typography variant="h5" fontWeight={700}>
                {money ? `₹${value.toLocaleString()}` : value}
            </Typography>
          )}
          {live && (
            <Typography variant="caption" color="success.main">
              ● live
            </Typography>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}

function AnalyticsCard({ label, value }: { label: string; value: number }) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h6" fontWeight={600}>
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
}

const thStyle = {
  padding: '12px',
  textAlign: 'left' as const,
  fontWeight: 600,
  fontSize: '14px',
};

const tdStyle = {
  padding: '12px',
  fontSize: '14px',
};
