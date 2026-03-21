import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Card,
  CardContent,
  Step,
  StepLabel,
  Stepper,
  Alert
} from '@mui/material';
import { 
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  Restaurant as RestaurantIcon,
  Home as HomeIcon
} from '@mui/icons-material';
import { useGetOrderByIdQuery } from '../api/orderApi';
import { useParams, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';

interface OrderStep {
  label: string;
  status: string;
  completed: boolean;
  icon: React.ReactNode;
  timestamp?: string;
}

const CustomerOrderTracking: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { data: order, isLoading, isError } = useGetOrderByIdQuery(Number(orderId));

    const [orderSteps, setOrderSteps] = useState<OrderStep[]>([]);

    useEffect(() => {
        if (order) {
            const steps: OrderStep[] = [
                {
                    label: 'Order Placed',
                    status: 'PENDING',
                    completed: ['PENDING', 'CONFIRMED', 'PROCESSING', 'READY', 'OUT FOR DELIVERY', 'DELIVERED'].includes(order.orderStatus?.toUpperCase()),
                    icon: <PendingIcon />,
                    timestamp: order.placedAt
                },
                {
                    label: 'Order Confirmed',
                    status: 'CONFIRMED',
                    completed: ['CONFIRMED', 'PROCESSING', 'READY', 'OUT FOR DELIVERY', 'DELIVERED'].includes(order.orderStatus?.toUpperCase()),
                    icon: <CheckCircleIcon />,
                },
                {
                    label: 'Preparing',
                    status: 'PROCESSING',
                    completed: ['PROCESSING', 'READY', 'OUT FOR DELIVERY', 'DELIVERED'].includes(order.orderStatus?.toUpperCase()),
                    icon: <RestaurantIcon />,
                },
                {
                    label: 'Ready for Pickup',
                    status: 'READY',
                    completed: ['READY', 'OUT FOR DELIVERY', 'DELIVERED'].includes(order.orderStatus?.toUpperCase()),
                    icon: <CheckCircleIcon />,
                },
                {
                    label: 'Out for Delivery',
                    status: 'OUT FOR DELIVERY',
                    completed: ['OUT FOR DELIVERY', 'DELIVERED'].includes(order.orderStatus?.toUpperCase()),
                    icon: <LocalShippingIcon />,
                },
                {
                    label: 'Delivered',
                    status: 'DELIVERED',
                    completed: order.orderStatus?.toUpperCase() === 'DELIVERED',
                    icon: <HomeIcon />,
                }
            ];
            setOrderSteps(steps);
        }
    }, [order]);

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

    const getActiveStep = () => {
        // Find the index of the first step that is NOT completed
        const nextStep = orderSteps.findIndex(step => !step.completed);
        // If all are completed, show the last step as active
        if (nextStep === -1) return orderSteps.length - 1;
        // The active step is the one before the first non-completed step
        return Math.max(0, nextStep - 1);
    };

    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                <CircularProgress />
            </Box>
        );
    }

    if (isError || !order) {
        return (
            <Box p={3}>
                <Button onClick={() => navigate('/my-orders')} sx={{ mb: 2 }}>
                    ← Back to Orders
                </Button>
                <Alert severity="error">
                    Order not found or failed to load. Please try again.
                </Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Button onClick={() => navigate('/my-orders')} sx={{ mb: 3 }}>
                ← Back to My Orders
            </Button>

            {/* Order Header */}
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Order #{order.orderNumber}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" gutterBottom>
                            Placed on {dayjs(order.placedAt).format('DD MMM YYYY, hh:mm A')}
                        </Typography>
                        {order.estimatedDeliveryTime && (
                            <Typography variant="body2" color="primary">
                                Estimated delivery: {dayjs(order.estimatedDeliveryTime).format('DD MMM YYYY, hh:mm A')}
                            </Typography>
                        )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Box display="flex" gap={2} justifyContent={{ xs: 'flex-start', md: 'flex-end' }}>
                            <Chip 
                                label={order.orderStatus?.toUpperCase() || ''} 
                                color={getStatusColor(order.orderStatus || '') as any}
                                size="medium"
                            />
                            <Chip 
                                label={order.paymentStatus?.toUpperCase() || ''} 
                                color={getPaymentStatusColor(order.paymentStatus || '') as any}
                                size="medium"
                            />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Order Tracking */}
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    Order Tracking
                </Typography>
                
                {order.orderStatus === 'CANCELLED' ? (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        This order has been cancelled.
                    </Alert>
                ) : (
                    <Stepper activeStep={getActiveStep()} alternativeLabel>
                        {orderSteps.map((step) => (
                            <Step key={step.label} completed={step.completed}>
                                <StepLabel
                                    icon={step.completed ? <CheckCircleIcon color="success" /> : step.icon}
                                >
                                    <Box>
                                        <Typography variant="body2">{step.label}</Typography>
                                        {step.timestamp && (
                                            <Typography variant="caption" color="textSecondary">
                                                {dayjs(step.timestamp).format('DD MMM, hh:mm A')}
                                            </Typography>
                                        )}
                                    </Box>
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                )}

                {order.deliveryPersonId && (
                    <Box mt={3}>
                        <Alert severity="info">
                            Your order has been assigned to a delivery partner.
                        </Alert>
                    </Box>
                )}
            </Paper>

            {/* Order Items */}
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    Order Items
                </Typography>

                {order.items?.map((item, index) => (
                    <Card key={index} sx={{ mb: 2 }}>
                        <CardContent>
                            <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 8 }}>
                                    <Typography variant="h6" fontWeight="bold">
                                        {item.productName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {item.variantName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        SKU: {item.sku}
                                    </Typography>
                                </Grid>
                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Box textAlign={{ xs: 'left', md: 'right' }}>
                                        <Typography variant="body2">
                                            Quantity: {item.quantity}
                                        </Typography>
                                        <Typography variant="body2">
                                            Unit Price: ₹{item.unitPrice.toFixed(2)}
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold">
                                            ₹{item.totalPrice.toFixed(2)}
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                ))}

                <Divider sx={{ my: 2 }} />

                <Box display="flex" justifyContent="flex-end">
                    <Typography variant="h5" fontWeight="bold">
                        Total: ₹{order.grandTotal.toFixed(2)}
                    </Typography>
                </Box>
            </Paper>

            {/* Action Buttons */}
            <Box display="flex" gap={2}>
                <Button variant="outlined" onClick={() => window.print()}>
                    Print Order
                </Button>
                {order.orderStatus === 'DELIVERED' && (
                    <Button variant="contained" onClick={() => navigate('/products')}>
                        Order Again
                    </Button>
                )}
                {['PENDING', 'CONFIRMED'].includes(order.orderStatus) && (
                    <Button variant="outlined" color="error">
                        Cancel Order
                    </Button>
                )}
            </Box>
        </Box>
    );
};

export default CustomerOrderTracking;
