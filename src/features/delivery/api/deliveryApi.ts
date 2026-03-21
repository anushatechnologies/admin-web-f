import { baseApiWithAuth } from '@api/baseApi';

export interface DeliveryPerson {
  id: number;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  verified: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface DeliveryDocument {
  id: number;
  deliveryPersonId: number;
  documentType: string;
  documentNumber: string;
  documentUrl: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  uploadedAt: string;
}

export interface FareSettings {
  id?: number;
  baseFare?: number;
  perKmRate?: number;
  minimumFare?: number;
  maximumFare?: number;
  km1Fare?: number;
  km5Fare?: number;
  km10Fare?: number;
  km20PlusFare?: number;
  nightSurcharge?: number;
  isActive?: boolean;
  updatedAt?: string;
}

export const deliveryApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    // 8.1 & 9.1 Dashboard Stats
    getDeliveryDashboardStats: builder.query<any, void>({
      query: () => '/admin/dashboard', // Document says /api/admin/dashboard (baseApi already has /api)
      providesTags: ['Dashboard'],
    }),

    // 8.2 & 9.2 All Delivery Persons
    getDeliveryPersons: builder.query<{ success: boolean; deliveryPersons: DeliveryPerson[] }, void>({
      query: () => '/admin/delivery-persons',
      providesTags: ['User'],
    }),

    // 8.3 & 9.3 Pending Approvals
    getPendingDeliveryPersons: builder.query<{ success: boolean; deliveryPersons: DeliveryPerson[] }, void>({
      query: () => '/admin/delivery-persons/pending-approval',
      providesTags: ['User'],
    }),

    // 8.4 Available Delivery Persons
    getAvailableDeliveryPersons: builder.query<{ success: boolean; deliveryPersons: DeliveryPerson[] }, void>({
      query: () => '/admin/delivery-persons/available',
      providesTags: ['User'],
    }),

    // 8.7 & 9.9 Pending Documents
    getPendingDocuments: builder.query<{ success: boolean; documents: DeliveryDocument[] }, void>({
      query: () => '/admin/documents/pending-review',
      providesTags: ['User'],
    }),

    // 8.8 & 9.10 Approve Document
    approveDocument: builder.mutation<any, { documentId: number; adminId: number }>({
      query: ({ documentId, adminId }) => ({
        url: `/admin/documents/${documentId}/approve`,
        method: 'POST',
        body: { adminId },
      }),
      invalidatesTags: ['User'],
    }),

    // 8.9 & 9.11 Reject Document
    rejectDocument: builder.mutation<any, { documentId: number; adminId: number; remarks: string }>({
      query: ({ documentId, ...body }) => ({
        url: `/admin/documents/${documentId}/reject`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    // 8.12 Assign Order to Delivery Person
    assignOrder: builder.mutation<any, { orderId: number; deliveryPersonId: number }>({
      query: ({ orderId, deliveryPersonId }) => ({
        url: `/admin/orders/${orderId}/assign`,
        method: 'POST',
        body: { deliveryPersonId },
      }),
      invalidatesTags: ['AdminOrders'],
    }),

    // 8.16 & 9.13 Get Fare Settings
    getFareSettings: builder.query<{ success: boolean; fareSettings: FareSettings }, void>({
      query: () => '/admin/fare-settings',
    }),

    // 8.17 & 9.14 Update Fare Settings
    updateFareSettings: builder.mutation<any, Partial<FareSettings> & { adminId?: number }>({
      query: (body) => ({
        url: '/admin-panel/api/fare-settings',
        method: 'PUT',
        body,
      }),
    }),

    // 9.2 Get Single Personnel
    getDeliveryPersonById: builder.query<{ success: boolean; deliveryPerson: DeliveryPerson & { email?: string, vehicleModel?: string, rating?: number, vehicleType?: string } }, number>({
      query: (id) => `/admin/delivery-persons/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // 9.1 Get Documents for Personnel
    getPersonnelDocuments: builder.query<{ success: boolean; documents: DeliveryDocument[] }, number>({
      query: (id) => `/admin/delivery-persons/${id}/documents`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),

    // 9.4 Approve Personnel (Final Account Approval)
    approvePersonnel: builder.mutation<any, { id: number; adminId: number }>({
      query: ({ id, adminId }) => ({
        url: `/admin-panel/api/delivery-persons/${id}/approve`,
        method: 'POST',
        body: { adminId }
      }),
      invalidatesTags: (result, error, { id }) => ['User', { type: 'User', id }],
    }),

    // Approve Photo
    approveDeliveryPersonPhoto: builder.mutation<any, { id: number; adminId: number }>({
      query: ({ id, adminId }) => ({
        url: `/admin-panel/api/delivery-persons/${id}/approve-photo`,
        method: 'POST',
        body: { adminId },
      }),
      invalidatesTags: (result, error, { id }) => ['User', { type: 'User', id }],
    }),

    // Reject Photo
    rejectDeliveryPersonPhoto: builder.mutation<any, { id: number; adminId: number; remarks: string }>({
      query: ({ id, adminId, remarks }) => ({
        url: `/admin-panel/api/delivery-persons/${id}/reject-photo`,
        method: 'POST',
        body: { adminId, remarks },
      }),
      invalidatesTags: (result, error, { id }) => ['User', { type: 'User', id }],
    }),

    // Request Photo Re-upload
    requestPhotoReupload: builder.mutation<any, { id: number; adminId: number; remarks: string }>({
      query: ({ id, adminId, remarks }) => ({
        url: `/admin-panel/api/delivery-persons/${id}/request-photo-reupload`,
        method: 'POST',
        body: { adminId, remarks },
      }),
      invalidatesTags: (result, error, { id }) => ['User', { type: 'User', id }],
    }),

    // 9.5 Reject Personnel
    rejectPersonnel: builder.mutation<any, { id: number; reason: string }>({
      query: ({ id, reason }) => ({
        url: '/admin/delivery-persons/reject',
        method: 'POST',
        body: { id, reason },
      }),
      invalidatesTags: (result, error, { id }) => ['User', { type: 'User', id }],
    }),
  }),
});

export const {
  useGetDeliveryDashboardStatsQuery,
  useGetDeliveryPersonsQuery,
  useGetPendingDeliveryPersonsQuery,
  useGetAvailableDeliveryPersonsQuery,
  useGetPendingDocumentsQuery,
  useApproveDocumentMutation,
  useRejectDocumentMutation,
  useAssignOrderMutation,
  useGetFareSettingsQuery,
  useUpdateFareSettingsMutation,
  useGetDeliveryPersonByIdQuery,
  useGetPersonnelDocumentsQuery,
  useApprovePersonnelMutation,
  useRejectPersonnelMutation,
  useApproveDeliveryPersonPhotoMutation,
  useRejectDeliveryPersonPhotoMutation,
  useRequestPhotoReuploadMutation,
} = deliveryApi;
