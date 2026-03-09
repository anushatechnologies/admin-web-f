const API_BASE_URL = 'http://localhost:9000/api/stores1';

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

export const fetchStores = async (search?: string): Promise<Store[]> => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  const res = await fetch(`${API_BASE_URL}?${params}`);
  if (!res.ok) throw new Error('Failed to fetch stores');
  return res.json();
};

export const fetchStoreById = async (id: number): Promise<Store> => {
  const res = await fetch(`${API_BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Store not found');
  return res.json();
};

export const createStore = async (storeData: StoreRequest, imageFile?: File): Promise<Store> => {
  const formData = new FormData();
  formData.append('store', new Blob([JSON.stringify(storeData)], { type: 'application/json' }));
  if (imageFile) formData.append('image', imageFile);
  const res = await fetch(API_BASE_URL, { method: 'POST', body: formData });
  if (!res.ok) throw new Error('Failed to create store');
  return res.json();
};

export const updateStore = async (id: number, storeData: StoreRequest, imageFile?: File): Promise<Store> => {
  const formData = new FormData();
  formData.append('store', new Blob([JSON.stringify(storeData)], { type: 'application/json' }));
  if (imageFile) formData.append('image', imageFile);
  const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'PUT', body: formData });
  if (!res.ok) throw new Error('Failed to update store');
  return res.json();
};

export const deleteStore = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete store');
};