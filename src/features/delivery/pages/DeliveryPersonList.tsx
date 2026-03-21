import React from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Chip, 
  Avatar,
  Stack
} from '@mui/material';
import ReusableTable from '../../../components/common/ReusableTable';
import { 
  useGetDeliveryPersonsQuery, 
  useGetPendingDeliveryPersonsQuery,
  DeliveryPerson
} from '../api/deliveryApi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DeliveryPersonList() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'all' | 'pending'>('all');
  
  const { data: allData, isLoading: isAllLoading } = useGetDeliveryPersonsQuery();
  const { data: pendingData, isLoading: isPendingLoading } = useGetPendingDeliveryPersonsQuery();

  const deliveryPersons = tab === 'all' 
    ? allData?.deliveryPersons || [] 
    : pendingData?.deliveryPersons || [];

  const isLoading = tab === 'all' ? isAllLoading : isPendingLoading;

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Delivery Personnel</Typography>
          <Typography color="text.secondary">Manage and approve delivery staff</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button 
            variant={tab === 'all' ? 'contained' : 'outlined'} 
            onClick={() => setTab('all')}
          >
            All Staff
          </Button>
          <Button 
            variant={tab === 'pending' ? 'contained' : 'outlined'} 
            color="warning"
            onClick={() => setTab('pending')}
          >
            Pending Approval ({pendingData?.deliveryPersons?.length || 0})
          </Button>
        </Stack>
      </Stack>

      <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
        <ReusableTable
          columns={[
            { 
              header: 'Name', 
              key: 'firstName',
              render: (row) => (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar sx={{ bgcolor: 'primary.main' }}>{row.firstName[0]}</Avatar>
                  <Typography variant="body2" fontWeight={600}>
                    {row.firstName} {row.lastName}
                  </Typography>
                </Stack>
              )
            },
            { header: 'Phone', key: 'phoneNumber' },
            { 
              header: 'Status', 
              key: 'approvalStatus',
              render: (row) => (
                <Chip 
                  label={row.approvalStatus} 
                  color={row.approvalStatus === 'APPROVED' ? 'success' : row.approvalStatus === 'PENDING' ? 'warning' : 'error'}
                  size="small"
                />
              )
            },
            { 
              header: 'Phone Verified', 
              key: 'verified',
              render: (row) => (
                <Chip 
                  label={row.verified ? 'Verified' : 'Unverified'} 
                  variant="outlined"
                  color={row.verified ? 'info' : 'default'}
                  size="small"
                />
              )
            },
            { 
                header: 'Joined', 
                key: 'createdAt',
                render: (row) => new Date(row.createdAt).toLocaleDateString()
            },
            {
              header: 'Actions',
              key: 'id',
              render: (row) => (
                <Button 
                    size="small" 
                    variant="text" 
                    onClick={() => navigate(`/admin/delivery/personnel/${row.id}`)}
                >
                    Details
                </Button>
              )
            }
          ]}
          data={deliveryPersons}
          loading={isLoading}
          currentPage={1}
          totalPages={1}
          onPageChange={() => {}}
        />
      </Card>
    </Box>
  );
}
