import { baseApiWithAuth } from '@api/baseApi';
import { 
  OrderResponse, 
  AdminOrderSummaryDto, 
  AdminOrderDetailDto, 
  AcceptOrderResponse, 
  AcceptOrderRequest,
  RejectOrderResponse, 
  RejectOrderRequest,
  AssignDeliveryResponse,
  AssignDeliveryRequest,
  PlaceOrderRequest
} from '../types/index';

export const orderApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    // Customer endpoints
    getMyOrders: builder.query<OrderResponse[], void>({
      query: () => '/orders',
      providesTags: ['Orders'],
    }),
    
    getOrderById: builder.query<OrderResponse, number>({
      query: (orderId) => `/orders/${orderId}`,
      providesTags: (result, error, id) => [{ type: 'Orders', id }],
    }),
    
    placeOrder: builder.mutation<OrderResponse, PlaceOrderRequest>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Orders'],
    }),
    
    // Admin endpoints
    getAdminOrders: builder.query<AdminOrderSummaryDto[], void>({
      query: () => '/admin/orders/all-orders',
      providesTags: ['AdminOrders'],
    }),
    
    getAdminOrderById: builder.query<AdminOrderDetailDto, number>({
      query: (orderId) => `/admin/orders/${orderId}`,
      providesTags: (result, error, id) => [{ type: 'AdminOrders', id }],
    }),
    
    acceptOrder: builder.mutation<AcceptOrderResponse, AcceptOrderRequest>({
      query: (requestData) => ({
        url: `/admin/orders/${requestData.orderId}/accept`,
        method: 'POST',
        body: requestData,
      }),
      invalidatesTags: ['AdminOrders'],
    }),
    
    rejectOrder: builder.mutation<RejectOrderResponse, RejectOrderRequest>({
      query: (requestData) => ({
        url: `/admin/orders/${requestData.orderId}/reject`,
        method: 'POST',
        body: requestData,
      }),
      invalidatesTags: ['AdminOrders'],
    }),
    
    assignDelivery: builder.mutation<AssignDeliveryResponse, AssignDeliveryRequest>({
      query: (requestData) => ({
        url: `/admin/orders/${requestData.orderId}/assign-delivery`,
        method: 'POST',
        body: requestData,
      }),
      invalidatesTags: ['AdminOrders'],
    }),
    
    // 7.6 Order Ready
    markOrderReady: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/orders/${id}/ready`,
        method: 'POST',
      }),
      invalidatesTags: ['AdminOrders', 'Orders'],
    }),

    // 7.7 Out for Delivery
    markOutForDelivery: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/orders/${id}/out-for-delivery`,
        method: 'POST',
      }),
      invalidatesTags: ['AdminOrders', 'Orders'],
    }),

    // 7.8 Complete Order
    completeOrder: builder.mutation<void, number>({
      query: (id) => ({
        url: `/admin/orders/${id}/complete`,
        method: 'POST',
      }),
      invalidatesTags: ['AdminOrders', 'Orders'],
    }),
  }),
  overrideExisting: false,
});

export const {
  // Customer hooks
  useGetMyOrdersQuery,
  useGetOrderByIdQuery,
  usePlaceOrderMutation,
  useGetAdminOrdersQuery,
  useGetAdminOrderByIdQuery,
  useAcceptOrderMutation,
  useRejectOrderMutation,
  useAssignDeliveryMutation,
  useMarkOrderReadyMutation,
  useMarkOutForDeliveryMutation,
  useCompleteOrderMutation,
} = orderApi;
