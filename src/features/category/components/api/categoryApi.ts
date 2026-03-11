// const API_BASE_URL = 'http://localhost:9000/api/categories';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE_URL = `${BASE_URL}/categories`;

import { Category } from '../../types/index';

// For creating/updating we send JSON (but image is separate in FormData)
export type CategoryRequest = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;

// GET all active categories
export const fetchCategories = async (): Promise<Category[]> => {
  const res = await fetch(API_BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

// GET category by ID
export const fetchCategoryById = async (id: number): Promise<Category> => {
  const res = await fetch(`${API_BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Category not found');
  return res.json();
};

// CREATE category with multipart/form-data
export const createCategory = async (
  data: CategoryRequest,
  imageFile?: File,
): Promise<Category> => {
  const formData = new FormData();
  formData.append('category', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (imageFile) formData.append('image', imageFile);

  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to create category');
  return res.json();
};

// UPDATE category with multipart/form-data
export const updateCategory = async (
  id: number,
  data: CategoryRequest,
  imageFile?: File,
): Promise<Category> => {
  const formData = new FormData();
  formData.append('category', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  if (imageFile) formData.append('image', imageFile);

  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!res.ok) throw new Error('Failed to update category');
  return res.json();
};

// Soft delete
export const deleteCategory = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete category');
};

// Hard delete
export const hardDeleteCategory = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/${id}/hard`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to permanently delete category');
};

// Search
export const searchCategories = async (keyword: string): Promise<Category[]> => {
  const res = await fetch(`${API_BASE_URL}/search?keyword=${encodeURIComponent(keyword)}`);
  if (!res.ok) throw new Error('Search failed');
  return res.json();
};

// Filter by minimum discount
export const filterCategoriesByDiscount = async (minDiscount: number): Promise<Category[]> => {
  const res = await fetch(`${API_BASE_URL}/filter/discount?minDiscount=${minDiscount}`);
  if (!res.ok) throw new Error('Filter failed');
  return res.json();
};
