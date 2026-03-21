import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Chip,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../api/orderApi';
import { OrderResponse } from '../types/index';
import dayjs from 'dayjs';

const MyOrders: React.FC = () => {
    const { data: orders, isLoading, isError } = useGetMyOrdersQuery();
    const navigate = useNavigate();

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

    const getPaymentStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'paid': return 'success';
            case 'unpaid': return 'warning';
            case 'refunded': return 'error';
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

    if (!orders || orders.length === 0) {
        return (
            <Box p={3}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    My Orders
                </Typography>
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography color="textSecondary">
                        You haven't placed any orders yet.
                    </Typography>
                    <Button 
                        variant="contained" 
                        sx={{ mt: 2 }}
                        onClick={() => navigate('/products')}
                    >
                        Start Shopping
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                My Orders
            </Typography>

            <Grid container spacing={3}>
                {orders.map((order: OrderResponse) => (
                    <Grid size={{ xs: 12, md: 6, lg: 4 }} key={order.id}>
                        <Card elevation={2} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6" fontWeight="bold">
                                        #{order.orderNumber}
                                    </Typography>
                                    <Chip 
                                        label={order.orderStatus?.toUpperCase() || ''} 
                                        color={getStatusColor(order.orderStatus || '') as any}
                                        size="small"
                                    />
                                </Box>
                                
                                <Box mb={2}>
                                    <Typography variant="body2" color="textSecondary">
                                        Placed on {dayjs(order.placedAt).format('DD MMM YYYY, hh:mm A')}
                                    </Typography>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box mb={2}>
                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        Order Items ({order.items?.length || 0})
                                    </Typography>
                                    {order.items?.slice(0, 3).map((item, index) => (
                                        <Box key={index} sx={{ mb: 1 }}>
                                            <Typography variant="body2">
                                                {item.productName} - {item.variantName}
                                            </Typography>
                                            <Typography variant="caption" color="textSecondary">
                                                {item.quantity} x ₹{item.unitPrice.toFixed(2)} = ₹{item.totalPrice.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    ))}
                                    {order.items && order.items.length > 3 && (
                                        <Typography variant="caption" color="textSecondary">
                                            +{order.items.length - 3} more items
                                        </Typography>
                                    )}
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="h6" fontWeight="bold">
                                        ₹{order.grandTotal.toFixed(2)}
                                    </Typography>
                                    <Chip 
                                        label={order.paymentStatus?.toUpperCase() || ''} 
                                        color={getPaymentStatusColor(order.paymentStatus || '') as any}
                                        size="small"
                                    />
                                </Box>

                                <Button 
                                    variant="outlined" 
                                    fullWidth
                                    onClick={() => navigate(`/orders/${order.id}/tracking`)}
                                >
                                    Track Order
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default MyOrders;
