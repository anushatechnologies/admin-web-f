import { baseApiWithAuth } from '@api/baseApi';

export interface DashboardStats {
  totalOrders: number;
  activeUsers: number;
  todayRevenue: number;
  newCustomers: number;
}

export interface OrderAnalytics {
  pending: number;
  confirmed: number;
  processing: number;
  shipped: number;
  delivered: number;
  cancelled: number;
  returned?: number;
  failed?: number;
}

export const dashboardApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    // 11.5 Dashboard Summary (Combo)
    getDashboardSummary: builder.query<DashboardStats, void>({
      query: () => '/admin/dashboard/summary',
      providesTags: ['Dashboard'],
    }),

    // 11.2 Active Users (Direct)
    getActiveUsers: builder.query<{ count: number }, void>({
      query: () => '/admin/dashboard/active-users',
      providesTags: ['Dashboard'],
    }),

    // 7.1 Recent Orders
    getRecentOrders: builder.query<any[], void>({
      query: () => '/admin/dashboard/recent-orders',
      providesTags: ['Dashboard', 'AdminOrders' as any],
    }),

    // For Analytics tab (if still needed, we'll keep logic or map from summary)
    getOrderAnalytics: builder.query<OrderAnalytics, string>({
      query: (period = 'today') => `/admin/dashboard/analytics?period=${period}`,
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetDashboardSummaryQuery,
  useGetActiveUsersQuery,
  useGetRecentOrdersQuery,
  useGetOrderAnalyticsQuery,
} = dashboardApi;
