import { baseApiWithAuth } from '@api/baseApi';

// const API_BASE_URL = 'http://localhost:9000/api/stores1';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/stores1`;

export interface Store {
  id: number;
  name: string;
  address: string;
  priceRange: string;
  phoneNumber: string;
  pincode: string;
  city: string;
  announcement: string;
  delivery: string;
  packageCost: string;
  active: boolean;
  rating: number;
  imageUrl: string;
  preferredOrder: number;
  timings: string;
}

export interface StoreRequest {
  name: string;
  address: string;
  priceRange: string;
  phoneNumber: string;
  pincode: string;
  city: string;
  announcement: string;
  delivery: string;
  packageCost: string;
  active: boolean;
  rating: number;
  preferredOrder: number;
  timings: string;
}

// --- RTK QUERY (for other modules) ---
export const storeApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    getStores: builder.query<Store[], string | void>({
      query: (search) => ({
        url: '/stores1',
        params: search ? { search } : {},
      }),
      providesTags: ['Stores'],
    }),
    getStoreById: builder.query<Store, number>({
      query: (id) => `/stores1/${id}`,
      providesTags: (result, error, id) => [{ type: 'Stores', id }],
    }),
    createStore: builder.mutation<Store, { data: StoreRequest; image?: File }>({
      query: ({ data, image }) => {
        const formData = new FormData();
        formData.append('store', new Blob([JSON.stringify(data)], { type: 'application/json' }));
        if (image) formData.append('image', image);
        return {
          url: '/stores1',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Stores'],
    }),
  }),
});

export const { useGetStoresQuery, useGetStoreByIdQuery, useCreateStoreMutation } = storeApi;

// --- MANUAL FETCH (for Store.tsx) ---
const getAuthHeaders = (isFormData = false) => {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (!isFormData) headers['Content-Type'] = 'application/json';
  return headers;
};

export const fetchStores = async (search?: string): Promise<Store[]> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  const res = await fetch(`${API_BASE_URL}?${params}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch stores');
  return res.json();
};

export const fetchStoreById = async (id: number): Promise<Store> => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Store not found');
  return res.json();
};

export const createStore = async (storeData: StoreRequest, imageFile?: File): Promise<Store> => {
  const formData = new FormData();
  formData.append('store', new Blob([JSON.stringify(storeData)], { type: 'application/json' }));
  if (imageFile) formData.append('image', imageFile);
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    body: formData,
    headers: getAuthHeaders(true),
  });
  if (!res.ok) throw new Error('Failed to create store');
  return res.json();
};

export const updateStore = async (
  id: number,
  storeData: StoreRequest,
  imageFile?: File,
): Promise<Store> => {
  const formData = new FormData();
  formData.append('store', new Blob([JSON.stringify(storeData)], { type: 'application/json' }));
  if (imageFile) formData.append('image', imageFile);
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    body: formData,
    headers: getAuthHeaders(true),
  });
  if (!res.ok) throw new Error('Failed to update store');
  return res.json();
};

export const deleteStore = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete store');
};