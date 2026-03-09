import { baseApiWithAuth } from '@api/baseApi';

export const dashboardApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardData: builder.query<any, void>({
      query: () => '/get-dashboard-data',
      providesTags: ['Dashboard'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetDashboardDataQuery } = dashboardApi;
