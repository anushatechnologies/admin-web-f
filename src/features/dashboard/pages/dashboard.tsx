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
} from '@mui/material';

type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Packaging'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Canceled'
  | 'Returned'
  | 'Failed';

interface Order {
  id: string;
  customer: string;
  date: string;
  amount: number;
  status: OrderStatus;
}

const initialOrders: Order[] = [
  {
    id: 'ORD-001',
    customer: 'Rahul Sharma',
    date: '2026-02-18',
    amount: 2499,
    status: 'Delivered',
  },
  {
    id: 'ORD-002',
    customer: 'Priya Patel',
    date: '2026-02-18',
    amount: 1899,
    status: 'Out for Delivery',
  },
  { id: 'ORD-003', customer: 'Amit Kumar', date: '2026-02-18', amount: 3250, status: 'Packaging' },
  { id: 'ORD-004', customer: 'Sneha Reddy', date: '2026-02-18', amount: 599, status: 'Pending' },
];

const currency = (v: number) => `₹${v.toLocaleString()}`;

const statusColor = (status: OrderStatus) => {
  switch (status) {
    case 'Delivered':
      return 'success';
    case 'Canceled':
    case 'Failed':
      return 'error';
    case 'Pending':
      return 'warning';
    case 'Out for Delivery':
      return 'info';
    default:
      return 'default';
  }
};

export default function AdminDashboard() {
  const [orders] = useState<Order[]>(initialOrders);
  const [activeUsers, setActiveUsers] = useState(3);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    const i = setInterval(() => {
      setActiveUsers(Math.floor(Math.random() * 10));
    }, 4000);
    return () => clearInterval(i);
  }, []);

  const analytics = useMemo(() => {
    const map: Record<OrderStatus, number> = {
      Pending: 0,
      Confirmed: 0,
      Packaging: 0,
      'Out for Delivery': 0,
      Delivered: 0,
      Canceled: 0,
      Returned: 0,
      Failed: 0,
    };
    orders.forEach((o) => map[o.status]++);
    return map;
  }, [orders]);

  return (
    <Box sx={{ p: 4, minHeight: '100vh' }}>
      {/* Header */}
      <Typography variant="h4" fontWeight={700} mb={4}>
        Welcome To Anusha Bazaar
      </Typography>

      {/* Stats Section */}
      <Grid container spacing={4} mb={4}>
        <Grid item xs={12} md={12}>
          <StatCard title="Total Orders" value={orders.length} />
        </Grid>
        <Grid item xs={12} md={12}>
          <StatCard title="Active Users" value={activeUsers} live />
        </Grid>
        <Grid item xs={12} md={12}>
          <StatCard title="Revenue" value={125000} money />
        </Grid>
        <Grid item xs={12} md={12}>
          <StatCard title="New Customers" value={8} />
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
            {Object.entries(analytics).map(([k, v]) => (
              <Grid item xs={6} md={3} key={k}>
                <AnalyticsCard label={k} value={v} />
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Orders Section */}
      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <CardHeader
          title="Recent Orders"
          titleTypographyProps={{ fontWeight: 600 }}
          action={<Button variant="contained">View All</Button>}
        />
        <Divider />
        <CardContent>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'var(--card-bg)' }}>
                  <th style={thStyle}>Order ID</th>
                  <th style={thStyle}>Customer</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Amount</th>
                  <th style={thStyle}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={tdStyle}>#{o.id}</td>
                    <td style={tdStyle}>{o.customer}</td>
                    <td style={tdStyle}>{o.date}</td>
                    <td style={tdStyle}>{currency(o.amount)}</td>
                    <td style={tdStyle}>
                      <Chip label={o.status} color={statusColor(o.status)} size="small" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
}: {
  title: string;
  value: number;
  live?: boolean;
  money?: boolean;
}) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={1}>
          <Typography variant="h5" fontWeight={700}>
            {money ? `₹${value.toLocaleString()}` : value}
          </Typography>
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
