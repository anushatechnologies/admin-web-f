import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@app/store';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  TextField,
  CircularProgress,
  Chip,
  Grid
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    useGetAdminOrderByIdQuery, 
    useGetOrderByIdQuery,
    useAcceptOrderMutation, 
    useRejectOrderMutation,
    useMarkOrderReadyMutation,
    useMarkOutForDeliveryMutation,
    useCompleteOrderMutation
} from '../api/orderApi';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';

const OrderDetail: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const userRole = useSelector((state: RootState) => state.auth.user?.role);
    const isAdmin = userRole === 'ADMIN' || userRole === 'ROLE_ADMIN';
    
    // API Hooks
    const { data: adminOrder, isLoading: isAdminLoading, isError: isAdminError, refetch: refetchAdmin } = useGetAdminOrderByIdQuery(Number(orderId), { skip: !isAdmin });
    const { data: customerOrder, isLoading: isCustomerLoading, isError: isCustomerError, refetch: refetchCustomer } = useGetOrderByIdQuery(Number(orderId), { skip: isAdmin });

    const order = isAdmin ? adminOrder : customerOrder;
    const isLoading = isAdmin ? isAdminLoading : isCustomerLoading;
    const isError = isAdmin ? isAdminError : isCustomerError;
    const refetch = isAdmin ? refetchAdmin : refetchCustomer;

    const [acceptOrder, { isLoading: isAccepting }] = useAcceptOrderMutation();
    const [rejectOrder, { isLoading: isRejecting }] = useRejectOrderMutation();
    const [markReady, { isLoading: isMarkingReady }] = useMarkOrderReadyMutation();
    const [markOutForDelivery, { isLoading: isMarkingOut }] = useMarkOutForDeliveryMutation();
    const [completeOrder, { isLoading: isCompleting }] = useCompleteOrderMutation();

    // Local State for Reject Modal
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');

    const handleAccept = async () => {
        try {
            await acceptOrder({ orderId: Number(orderId) }).unwrap();
            toast.success('Order accepted successfully');
            refetch(); 
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to accept order');
        }
    };

    const handleRejectOpen = () => {
        setRejectReason('');
        setRejectModalOpen(true);
    };

    const handleRejectClose = () => {
        setRejectModalOpen(false);
    };

    const handleRejectConfirm = async () => {
        if (!rejectReason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        try {
            await rejectOrder({ 
                orderId: Number(orderId), 
                reason: rejectReason 
            }).unwrap();
            
            toast.success('Order rejected successfully');
            setRejectModalOpen(false);
            refetch(); 
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to reject order');
        }
    };
    const handleAction = async (actionFn: (id: number) => any, successMsg: string) => {
        try {
            await actionFn(Number(orderId)).unwrap();
            toast.success(successMsg);
            refetch();
        } catch (error: any) {
            toast.error(error?.data?.message || 'Action failed');
        }
    };

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

    if (isError || !order) {
        return (
            <Box p={3}>
                <Typography color="error">Failed to load order details or order not found.</Typography>
                <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Back to Orders</Button>
            </Box>
        );
    }

    const items = order.items || [];

    return (
        <Box p={3} maxWidth="1200px" mx="auto">
            {/* Header */}
            <Box display="flex" alignItems="center" mb={3} gap={2}>
                <Button 
                    startIcon={<ArrowBackIcon />} 
                    onClick={() => navigate(-1)}
                    color="inherit"
                >
                    Back
                </Button>
                <Typography variant="h4" fontWeight="bold">
                    Order #{order.orderNumber}
                </Typography>
                <Chip 
                    label={order.orderStatus?.toUpperCase() || ''} 
                    color={getStatusColor(order.orderStatus || '') as any} 
                />
            </Box>

            {/* Admin Action Buttons */}
            {isAdmin && (
                <Box mb={4} display="flex" gap={2} flexWrap="wrap">
                    {order.orderStatus?.toLowerCase() === 'pending' && (
                        <>
                            <Button 
                                variant="contained" 
                                color="success" 
                                onClick={handleAccept}
                                disabled={isAccepting || isRejecting}
                            >
                                {isAccepting ? <CircularProgress size={24} color="inherit" /> : 'Accept Order'}
                            </Button>
                            <Button 
                                variant="contained" 
                                color="error" 
                                onClick={handleRejectOpen}
                                disabled={isAccepting || isRejecting}
                            >
                                Reject Order
                            </Button>
                        </>
                    )}

                    {(order.orderStatus?.toLowerCase() === 'confirmed' || order.orderStatus?.toLowerCase() === 'processing') && (
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={() => handleAction(markReady, 'Order marked as ready')}
                            disabled={isMarkingReady}
                        >
                            {isMarkingReady ? <CircularProgress size={24} color="inherit" /> : 'Mark as Ready'}
                        </Button>
                    )}

                    {order.orderStatus?.toLowerCase() === 'ready' && (
                        <Button 
                            variant="contained" 
                            color="info" 
                            onClick={() => handleAction(markOutForDelivery, 'Order is on its way')}
                            disabled={isMarkingOut}
                        >
                            {isMarkingOut ? <CircularProgress size={24} color="inherit" /> : 'Out for Delivery'}
                        </Button>
                    )}

                    {order.orderStatus?.toLowerCase() === 'out for delivery' && (
                        <Button 
                            variant="contained" 
                            color="success" 
                            onClick={() => handleAction(completeOrder, 'Order completed successfully')}
                            disabled={isCompleting}
                        >
                            {isCompleting ? <CircularProgress size={24} color="inherit" /> : 'Complete Order'}
                        </Button>
                    )}
                </Box>
            )}

            <Grid container spacing={3}>
                {/* Information Column */}
                <Grid size={{ xs: 12, md: 4 }}>
                    {isAdmin && adminOrder && (
                        <>
                            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                                <Typography variant="h6" gutterBottom fontWeight="bold">Customer Info</Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Typography variant="body1"><b>Name:</b> {adminOrder.customerName}</Typography>
                                <Typography variant="body1"><b>Phone:</b> {adminOrder.customerPhone}</Typography>
                                {adminOrder.customerEmail && (
                                    <Typography variant="body1"><b>Email:</b> {adminOrder.customerEmail}</Typography>
                                )}
                                <Typography variant="body1" mt={1}>
                                    <b>Placed On:</b> {dayjs(adminOrder.placedAt).format('DD MMM YYYY, hh:mm A')}
                                </Typography>
                            </Paper>

                            {adminOrder.address && (
                                <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                                    <Typography variant="h6" gutterBottom fontWeight="bold">Delivery Address</Typography>
                                    <Divider sx={{ mb: 2 }} />
                                    <Typography variant="body1">
                                        {adminOrder.address.addressLine1}
                                        {adminOrder.address.addressLine2 && `, ${adminOrder.address.addressLine2}`}
                                    </Typography>
                                    {adminOrder.address.landmark && (
                                        <Typography variant="body1">Landmark: {adminOrder.address.landmark}</Typography>
                                    )}
                                    <Typography variant="body1">
                                        {adminOrder.address.city}, {adminOrder.address.state} - {adminOrder.address.postalCode}
                                    </Typography>
                                </Paper>
                            )}
                        </>
                    )}

                    {!isAdmin && (
                        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" gutterBottom fontWeight="bold">Order Summary</Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Box mb={2}>
                                <Typography variant="body2" color="textSecondary">Status</Typography>
                                <Chip 
                                    label={order.orderStatus?.toUpperCase() || ''} 
                                    color={getStatusColor(order.orderStatus || '') as any} 
                                    size="small"
                                />
                            </Box>
                            <Box mb={2}>
                                <Typography variant="body2" color="textSecondary">Payment Status</Typography>
                                <Chip 
                                    size="small" 
                                    label={order.paymentStatus?.toUpperCase() || ''} 
                                    color={order.paymentStatus?.toLowerCase() === 'paid' ? 'success' : 'warning'}
                                />
                            </Box>
                            <Box>
                                <Typography variant="body2" color="textSecondary">Placed On</Typography>
                                <Typography variant="body1">
                                    {dayjs(order.placedAt).format('DD MMM YYYY, hh:mm A')}
                                </Typography>
                            </Box>
                        </Paper>
                    )}

                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Payment Info</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1"><b>Method:</b> {order.paymentMethod}</Typography>
                        <Box mt={1}>
                            <b>Status:</b> 
                            <Chip 
                                size="small" 
                                label={order.paymentStatus?.toUpperCase() || ''} 
                                color={order.paymentStatus?.toLowerCase() === 'paid' ? 'success' : 'warning'}
                                sx={{ ml: 1 }}
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Order Items Column */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper elevation={2} sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">Order Items</Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        {items.map((item, index) => (
                            <Box key={index} mb={2} p={2} border={1} borderColor="grey.200" borderRadius={1}>
                                <Grid container alignItems="center">
                                <Grid size={{ xs: 12, sm: 8 }}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {item.productName} ({item.variantName})
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            SKU: {item.sku}
                                        </Typography>
                                        <Typography variant="body2" mt={1}>
                                            ₹{item.unitPrice.toFixed(2)} x {item.quantity}
                                        </Typography>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 4 }} sx={{ textAlign: { xs: 'left', sm: 'right' }, mt: { xs: 1, sm: 0 } }}>
                                        <Typography variant="h6" fontWeight="bold">
                                            ₹{item.totalPrice.toFixed(2)}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))}
                        
                        <Box display="flex" justifyContent="flex-end" mt={3} pt={2} borderTop={1} borderColor="grey.300">
                            <Typography variant="h5" fontWeight="bold">
                                Grand Total: ₹{order.grandTotal.toFixed(2)}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Reject Reason Modal */}
            <Dialog open={rejectModalOpen} onClose={handleRejectClose} maxWidth="sm" fullWidth>
                <DialogTitle>Reject Order</DialogTitle>
                <DialogContent>
                    <DialogContentText mb={2}>
                        Please provide a reason for rejecting this order.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="reason"
                        label="Rejection Reason"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRejectClose} color="inherit">Cancel</Button>
                    <Button 
                        onClick={handleRejectConfirm} 
                        color="error" 
                        variant="contained"
                        disabled={isRejecting || !rejectReason.trim()}
                    >
                        {isRejecting ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default OrderDetail;
