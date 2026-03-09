const API_BASE_URL = 'http://localhost:9000/api/products';

import { Product } from '../../category/types/index'

export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  discountPrice: number;
  stock: number;
  isActive: boolean;
  isTrending: boolean;
  displayOrder: number;
  categoryId: number;
  subCategoryId: number;
  storeId?: number;
}

// Helper to convert backend Product to frontend shape (if needed, but backend returns full object)
const mapProduct = (data: any): Product => data; // backend already returns full object with relations

// GET all products (optional store filter)
export const fetchProducts = async (storeId?: number): Promise<Product[]> => {
  const params = new URLSearchParams();
  if (storeId) params.append('storeId', storeId.toString());
  const res = await fetch(`${API_BASE_URL}?${params}`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
};

// GET single product
export const fetchProductById = async (id: number): Promise<Product> => {
  const res = await fetch(`${API_BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Product not found');
  return res.json();
};

// CREATE with image
export const createProduct = async (
  data: ProductRequest,
  imageFile?: File
): Promise<Product> => {
  const formData = new FormData();
  formData.append('product', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (imageFile) formData.append('image', imageFile);

  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
};

// UPDATE with optional image
export const updateProduct = async (
  id: number,
  data: ProductRequest,
  imageFile?: File
): Promise<Product> => {
  const formData = new FormData();
  formData.append('product', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (imageFile) formData.append('image', imageFile);

  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to update product');
  return res.json();
};

// DELETE (hard)
export const deleteProduct = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete product');
};

// SEARCH
export const searchProducts = async (keyword: string): Promise<Product[]> => {
  const res = await fetch(`${API_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
};
export const searchCategories = async (keyword: string): Promise<Category[]> => {
  const res = await fetch(`${API_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
};

// TRENDING
export const getTrendingProducts = async (): Promise<Product[]> => {
  const res = await fetch(`${API_BASE_URL}/trending`);
  if (!res.ok) throw new Error('Failed to fetch trending products');
  return res.json();
};

// FILTER
export const filterProducts = async (params: {
  categoryId?: number;
  subCategoryId?: number;
  storeId?: number;
  minPrice?: number;
  maxPrice?: number;
  trending?: boolean;
  keyword?: string;
}): Promise<Product[]> => {
  const query = new URLSearchParams();
  if (params.categoryId) query.append('categoryId', params.categoryId.toString());
  if (params.subCategoryId) query.append('subCategoryId', params.subCategoryId.toString());
  if (params.storeId) query.append('storeId', params.storeId.toString());
  if (params.minPrice) query.append('minPrice', params.minPrice.toString());
  if (params.maxPrice) query.append('maxPrice', params.maxPrice.toString());
  if (params.trending !== undefined) query.append('trending', params.trending.toString());
  if (params.keyword) query.append('keyword', params.keyword);

  const res = await fetch(`${API_BASE_URL}/filter?${query}`);
  if (!res.ok) throw new Error('Filter failed');
  return res.json();
};