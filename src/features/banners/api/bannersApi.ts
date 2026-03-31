import { baseApiWithAuth, baseApi } from '@api/baseApi';

export interface Banner {
  id?: number;
  name: string;
  imageUrl: string;
  videoUrl?: string;
  targetUrl?: string;
  isActive: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export const bannersApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    // Admin: Create Banner
    createBanner: builder.mutation<any, { banner: Partial<Banner>; image?: File; video?: File }>({
      query: ({ banner, image, video }) => {
        const formData = new FormData();
        if (banner.name) formData.append('name', banner.name);
        if (banner.targetUrl) formData.append('targetUrl', banner.targetUrl);
        if (banner.displayOrder !== undefined) formData.append('displayOrder', banner.displayOrder.toString());
        if (banner.isActive !== undefined) formData.append('isActive', banner.isActive.toString());
        
        if (image) formData.append('image', image);
        if (video) formData.append('video', video);
        
        return {
          url: '/admin-panel/api/banners',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Banners' as any],
    }),
    
    // Admin: Get All Banners 
    getAdminBanners: builder.query<any, void>({
      query: () => '/admin-panel/api/banners',
      providesTags: ['Banners' as any],
    }),

    // Admin: Toggle Banner Status
    toggleBannerStatus: builder.mutation<any, { id: number; isActive: boolean }>({
      query: ({ id, isActive }) => ({
        url: `/admin-panel/api/banners/${id}/status`,
        method: 'PUT',
        body: { isActive },
      }),
      invalidatesTags: ['Banners' as any],
    }),

    // Admin: Delete Banner
    deleteBanner: builder.mutation<any, number>({
      query: (id) => ({
        url: `/admin-panel/api/banners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Banners' as any],
    }),
  }),
});

// Since customer endpoint is /api/customer/banners, we add it to baseApi (no auth) or baseApiWithAuth depending on requirements.
// Usually customer endpoints don't need admin auth.
export const customerBannersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Customer: Get Active Banners
    getCustomerBanners: builder.query<any, void>({
      query: () => '/api/customer/banners',
      providesTags: ['Banners' as any],
    }),
  }),
});

export const {
  useCreateBannerMutation,
  useGetAdminBannersQuery,
  useToggleBannerStatusMutation,
  useDeleteBannerMutation,
} = bannersApi;

export const {
  useGetCustomerBannersQuery,
} = customerBannersApi;
