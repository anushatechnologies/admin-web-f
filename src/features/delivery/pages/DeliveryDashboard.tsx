import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Stack,
  CircularProgress
} from '@mui/material';
import { useGetDeliveryDashboardStatsQuery } from '../api/deliveryApi';

export default function DeliveryDashboard() {
  const { data, isLoading } = useGetDeliveryDashboardStatsQuery();
  const stats = data?.statistics || {};

  return (
    <Box sx={{ p: 4 }}>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700}>Delivery Overview</Typography>
        <Typography color="text.secondary">Real-time delivery operations and staff metrics</Typography>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>
      ) : (
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
             <SummaryCard title="Total Personnel" value={stats.totalDeliveryPersons || 0} color="primary.main" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
             <SummaryCard title="Approved Staff" value={stats.approvedDeliveryPersons || 0} color="success.main" />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
             <SummaryCard title="Pending Approvals" value={stats.pendingApprovals || 0} color="warning.main" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
             <SummaryCard title="Total Orders" value={stats.totalOrders || 0} color="secondary.main" />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
             <SummaryCard title="Active Assignments" value={stats.activeOrders || 0} color="info.main" />
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

function SummaryCard({ title, value, color }: { title: string; value: number; color: string }) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">{title}</Typography>
        <Typography variant="h3" fontWeight={700} color={color} mt={1}>{value}</Typography>
      </CardContent>
    </Card>
  );
}
