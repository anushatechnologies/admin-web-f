import React, { useState } from 'react';
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
    Button,
    Chip,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    Grid,
    IconButton,
    Menu,
    MenuItem
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    LocalShipping as LocalShippingIcon,
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import {
    useGetAdminOrdersQuery,
    useGetAdminOrderByIdQuery,
    useAcceptOrderMutation,
    useRejectOrderMutation,
    useAssignDeliveryMutation,
    useMarkOrderReadyMutation,
    useMarkOutForDeliveryMutation,
    useCompleteOrderMutation
} from '../api/orderApi';
import { useGetAvailableDeliveryPersonsQuery } from '../../delivery/api/deliveryApi';
import { AdminOrderSummaryDto, AdminOrderDetailDto } from '../types/index';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';

const AdminOrderDashboard: React.FC = () => {
    const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState<number | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentOrderForMenu, setCurrentOrderForMenu] = useState<AdminOrderSummaryDto | null>(null);

    const { data: orders, isLoading, isError, refetch } = useGetAdminOrdersQuery();
    const { data: orderDetail, isFetching: isDetailFetching } = useGetAdminOrderByIdQuery(selectedOrderId || 0, {
        skip: !selectedOrderId
    });

    const [acceptOrder] = useAcceptOrderMutation();
    const [rejectOrder, { isLoading: isRejecting }] = useRejectOrderMutation();
    const [assignDelivery, { isLoading: isAssigning }] = useAssignDeliveryMutation();
    const [markReady] = useMarkOrderReadyMutation();
    const [markOutForDelivery] = useMarkOutForDeliveryMutation();
    const [completeOrder] = useCompleteOrderMutation();

    const { data: availablePersonnel, isLoading: isLoadingPersonnel } = useGetAvailableDeliveryPersonsQuery();

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
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
        switch (status.toLowerCase()) {
            case 'paid': return 'success';
            case 'unpaid': return 'warning';
            case 'refunded': return 'error';
            default: return 'default';
        }
    };

    const handleMenuClick = (event: React.MouseEvent<HTMLElement>, order: AdminOrderSummaryDto) => {
        setAnchorEl(event.currentTarget);
        setCurrentOrderForMenu(order);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setCurrentOrderForMenu(null);
    };

    const handleViewDetails = () => {
        if (currentOrderForMenu) {
            setSelectedOrderId(currentOrderForMenu.id);
            setDetailDialogOpen(true);
        }
        handleMenuClose();
    };

    const handleAcceptOrder = async () => {
        if (currentOrderForMenu) {
            try {
                await acceptOrder({ orderId: currentOrderForMenu.id }).unwrap();
                toast.success('Order accepted successfully!');
                refetch();
            } catch (error) {
                toast.error('Failed to accept order');
            }
        }
        handleMenuClose();
    };

    const handleAction = async (actionFn: (id: number) => any, successMsg: string) => {
        if (currentOrderForMenu) {
            try {
                await actionFn(currentOrderForMenu.id).unwrap();
                toast.success(successMsg);
                refetch();
            } catch (error) {
                toast.error('Action failed');
            }
        }
        handleMenuClose();
    };

    const handleRejectOrder = async () => {
        if (currentOrderForMenu && rejectReason.trim()) {
            try {
                await rejectOrder({
                    orderId: currentOrderForMenu.id,
                    reason: rejectReason
                }).unwrap();
                toast.success('Order rejected successfully!');
                setRejectDialogOpen(false);
                setRejectReason('');
                refetch();
            } catch (error) {
                toast.error('Failed to reject order');
            }
        }
        handleMenuClose();
    };

    const handleAssignDelivery = () => {
        setAssignDialogOpen(true);
        handleMenuClose();
    };

    const handleConfirmAssignDelivery = async () => {
        if (currentOrderForMenu && selectedDeliveryPerson) {
            try {
                await assignDelivery({
                    orderId: currentOrderForMenu.id,
                    deliveryPersonId: selectedDeliveryPerson,
                    estimatedDeliveryTime: dayjs().add(2, 'hour').toISOString()
                }).unwrap();
                toast.success('Order assigned to delivery person!');
                setAssignDialogOpen(false);
                setSelectedDeliveryPerson(null);
                refetch();
            } catch (error) {
                toast.error('Failed to assign delivery');
            }
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
                <Alert severity="error">Failed to load orders. Please try again.</Alert>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
                Order Management
            </Typography>

            <TableContainer component={Paper} elevation={2}>
                <Table>
                    <TableHead>
                        <TableRow className="bg-gray-100">
                            <TableCell style={{ fontWeight: 'bold' }}>Order #</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Customer Name</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Total (₹)</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Payment</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders && orders.length > 0 ? (
                            orders.map((order: AdminOrderSummaryDto) => (
                                <TableRow key={order.id} hover>
                                    <TableCell>{order.orderNumber}</TableCell>
                                    <TableCell>
                                        {dayjs(order.placedAt).format('DD MMM YYYY, hh:mm A')}
                                    </TableCell>
                                    <TableCell>{order.customerName}</TableCell>
                                    <TableCell>{order.customerPhone}</TableCell>
                                    <TableCell>₹{order.grandTotal.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.orderStatus.toUpperCase()}
                                            color={getStatusColor(order.orderStatus) as any}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={order.paymentStatus.toUpperCase()}
                                            color={getPaymentStatusColor(order.paymentStatus) as any}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={(e) => handleMenuClick(e, order)}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    <Typography py={3} color="textSecondary">
                                        No orders found.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Action Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleViewDetails}>
                    <PersonIcon sx={{ mr: 1 }} />
                    View Details
                </MenuItem>
                <MenuItem onClick={handleAcceptOrder} disabled={currentOrderForMenu?.orderStatus?.toUpperCase() !== 'PENDING'}>
                    <CheckCircleIcon sx={{ mr: 1 }} />
                    Accept Order
                </MenuItem>
                <MenuItem onClick={() => setRejectDialogOpen(true)} disabled={currentOrderForMenu?.orderStatus?.toUpperCase() !== 'PENDING'}>
                    <CancelIcon sx={{ mr: 1 }} />
                    Reject Order
                </MenuItem>
                <MenuItem onClick={handleAssignDelivery} disabled={currentOrderForMenu?.orderStatus?.toUpperCase() !== 'CONFIRMED'}>
                    <LocalShippingIcon sx={{ mr: 1 }} />
                    Assign Delivery
                </MenuItem>
                <MenuItem onClick={() => handleAction(markReady, 'Order marked as ready')} disabled={currentOrderForMenu?.orderStatus?.toUpperCase() !== 'CONFIRMED' && currentOrderForMenu?.orderStatus?.toUpperCase() !== 'PROCESSING'}>
                    <CheckCircleIcon sx={{ mr: 1 }} />
                    Mark as Ready
                </MenuItem>
                <MenuItem onClick={() => handleAction(markOutForDelivery, 'Order is on its way')} disabled={currentOrderForMenu?.orderStatus?.toUpperCase() !== 'READY'}>
                    <LocalShippingIcon sx={{ mr: 1 }} />
                    Out for Delivery
                </MenuItem>
                <MenuItem onClick={() => handleAction(completeOrder, 'Order completed successfully')} disabled={currentOrderForMenu?.orderStatus?.toUpperCase() !== 'OUT FOR DELIVERY'}>
                    <CheckCircleIcon sx={{ mr: 1 }} />
                    Complete Order
                </MenuItem>
            </Menu>

            {/* Order Details Dialog */}
            <Dialog
                open={detailDialogOpen}
                onClose={() => setDetailDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Order Details - {orderDetail?.orderNumber || ''}</DialogTitle>
                <DialogContent>
                    {isDetailFetching ? (
                        <Box display="flex" justifyContent="center" p={3}>
                            <CircularProgress />
                        </Box>
                    ) : orderDetail ? (
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="h6" gutterBottom>Customer Information</Typography>
                                <Typography>Name: {orderDetail.customerName}</Typography>
                                <Typography>Phone: {orderDetail.customerPhone}</Typography>
                                <Typography>Email: {orderDetail.customerEmail || 'N/A'}</Typography>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="h6" gutterBottom>Delivery Address</Typography>
                                {orderDetail.address ? (
                                    <>
                                        <Typography>{orderDetail.address.addressLine1}</Typography>
                                        {orderDetail.address.addressLine2 && <Typography>{orderDetail.address.addressLine2}</Typography>}
                                        <Typography>{orderDetail.address.city}, {orderDetail.address.state}</Typography>
                                        <Typography>{orderDetail.address.postalCode}</Typography>
                                    </>
                                ) : (
                                    <Typography>Address not available</Typography>
                                )}
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>Order Items</Typography>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow className="bg-gray-100">
                                                <TableCell>Item</TableCell>
                                                <TableCell>Price</TableCell>
                                                <TableCell align="center">Qty</TableCell>
                                                <TableCell align="right">Total</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {orderDetail.items && orderDetail.items.map((item: any, index: number) => (
                                                <TableRow key={index}>
                                                    <TableCell>
                                                        <Typography variant="body2">{item.productName}</Typography>
                                                        {item.variantName && (
                                                            <Typography variant="caption" color="textSecondary">{item.variantName}</Typography>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>₹{item.unitPrice}</TableCell>
                                                    <TableCell align="center">{item.quantity}</TableCell>
                                                    <TableCell align="right">₹{item.totalPrice}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow>
                                                <TableCell colSpan={3} align="right"><strong>Grand Total</strong></TableCell>
                                                <TableCell align="right"><strong>₹{orderDetail.grandTotal?.toFixed(2)}</strong></TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid>
                    ) : (
                        <Box p={3}>
                            <Alert severity="error">Failed to load order details</Alert>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Reject Order Dialog */}
            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
                <DialogTitle>Reject Order</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Rejection Reason"
                        fullWidth
                        multiline
                        rows={4}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Please provide a reason for rejection..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleRejectOrder}
                        color="error"
                        disabled={!rejectReason.trim() || isRejecting}
                    >
                        {isRejecting ? <CircularProgress size={20} /> : 'Reject Order'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Assign Delivery Dialog */}
            <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)}>
                <DialogTitle>Assign Delivery Person</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Select a delivery person for order {currentOrderForMenu?.orderNumber}
                    </Typography>
                    {isLoadingPersonnel ? (
                        <CircularProgress size={24} />
                    ) : availablePersonnel?.deliveryPersons?.length ? (
                        <TextField
                            select
                            fullWidth
                            label="Select Personnel"
                            value={selectedDeliveryPerson || ''}
                            onChange={(e) => setSelectedDeliveryPerson(Number(e.target.value))}
                            SelectProps={{ native: true }}
                        >
                            <option value=""></option>
                            {availablePersonnel.deliveryPersons.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.firstName} {p.lastName} ({p.phoneNumber})
                                </option>
                            ))}
                        </TextField>
                    ) : (
                        <Alert severity="warning">No available delivery personnel found.</Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleConfirmAssignDelivery}
                        disabled={!selectedDeliveryPerson || isAssigning}
                    >
                        {isAssigning ? <CircularProgress size={20} /> : 'Assign Delivery'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminOrderDashboard;
