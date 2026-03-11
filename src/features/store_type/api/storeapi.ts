// const API_BASE_URL = 'http://localhost:9000/api/stores';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/stores`;

export interface Store {
  id: number;
  name: string;
  label: string;
  displayOrder: number;
  active: boolean;
  imageUrl: string;
  store1Id: number; // ← NEW field – must be returned by backend
}

export interface StoreRequest {
  name: string;
  label: string;
  displayOrder: number;
  active: boolean;
  store1Id: number; // ← NEW field – sent to backend
}

export const fetchStores = async (
  name?: string,
  page = 0,
  size = 10,
  sort?: string,
): Promise<{ content: Store[]; totalPages: number; totalElements: number }> => {
  const params = new URLSearchParams();
  if (name) params.append('name', name);
  params.append('page', page.toString());
  params.append('size', size.toString());
  if (sort) params.append('sort', sort);
  const res = await fetch(`${API_BASE_URL}?${params}`);
  if (!res.ok) throw new Error('Failed to fetch stores');
  return res.json();
};

export const fetchStoreById = async (id: number): Promise<Store> => {
  const res = await fetch(`${API_BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Store not found');
  return res.json();
};

export const suggestStores = async (query: string): Promise<Store[]> => {
  const res = await fetch(`${API_BASE_URL}/suggest?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Failed to suggest stores');
  return res.json();
};

export const createStore = async (storeData: StoreRequest, imageFile: File): Promise<Store> => {
  const formData = new FormData();
  formData.append('store', new Blob([JSON.stringify(storeData)], { type: 'application/json' }));
  formData.append('image', imageFile);
  const res = await fetch(API_BASE_URL, { method: 'POST', body: formData });
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
  const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'PUT', body: formData });
  if (!res.ok) throw new Error('Failed to update store');
  return res.json();
};

export const deleteStore = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete store');
};
