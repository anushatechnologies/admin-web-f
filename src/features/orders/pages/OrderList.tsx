import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip,
  CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetAdminOrdersQuery } from '../api/orderApi';
import { AdminOrderSummaryDto } from '../types/index';
import dayjs from 'dayjs';

const OrderList: React.FC = () => {
    const { data: ordersResponse, isLoading, isError } = useGetAdminOrdersQuery();
    const navigate = useNavigate();
    
    // Extract orders array from response - handle different response structures
    let orders: AdminOrderSummaryDto[] = [];
    if (ordersResponse && typeof ordersResponse === 'object') {
        if (Array.isArray(ordersResponse)) {
            orders = ordersResponse;
        } else if ('orders' in ordersResponse && Array.isArray((ordersResponse as any).orders)) {
            orders = (ordersResponse as any).orders;
        } else if ('data' in ordersResponse && Array.isArray((ordersResponse as any).data)) {
            orders = (ordersResponse as any).data;
        }
    }
    
    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'warning';
            case 'confirmed': return 'info';
            case 'processing': return 'info';
            case 'shipped': return 'primary';
            case 'delivered': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (isError) {
        return (
            <Box p={3}>
                <Typography color="error">Failed to load orders.</Typography>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Orders
            </Typography>

            <TableContainer component={Paper} elevation={2}>
                <Table>
                    <TableHead>
                        <TableRow className="bg-gray-100">
                            <TableCell style={{ fontWeight: 'bold' }}>Order #</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Customer</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.length > 0 ? (
                            orders.map((order) => (
                                <TableRow 
                                    key={order.id} 
                                    hover 
                                    sx={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                                >
                                    <TableCell>{order.orderNumber}</TableCell>
                                    <TableCell>
                                        {dayjs(order.placedAt).format('DD MMM YYYY')}
                                    </TableCell>
                                    <TableCell>{order.customerName}</TableCell>
                                    <TableCell>₹{order.grandTotal.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={order.orderStatus?.toUpperCase() || ''} 
                                            color={getStatusColor(order.orderStatus || '') as any} 
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <Typography py={3} color="textSecondary">No orders found.</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default OrderList;
