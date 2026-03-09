// const API_BASE_URL = 'http://localhost:9000/api/subcategories';

// import { SubCategory } from '../../types/index';

// // Frontend request shape (flattened)
// export interface SubCategoryRequest {
//   name: string;
//   description?: string;
//   isActive: boolean;
//   displayOrder: number;
//   discount: number;
//   categoryId: number;
// }

// // Helper to convert frontend request to backend payload (expects category object)
// const toBackendPayload = (data: SubCategoryRequest) => ({
//   name: data.name,
//   description: data.description || '',
//   isActive: data.isActive,
//   displayOrder: data.displayOrder,
//   discount: data.discount,
//   category: { id: data.categoryId },
// });

// // GET subcategories by category ID
// export const fetchSubCategoriesByCategory = async (categoryId: number): Promise<SubCategory[]> => {
//   const res = await fetch(`${API_BASE_URL}/${categoryId}`);
//   if (!res.ok) throw new Error('Failed to fetch subcategories');
//   return res.json();
// };

// // GET single subcategory by ID
// export const fetchSubCategoryById = async (id: number): Promise<SubCategory> => {
//   const res = await fetch(`${API_BASE_URL}/detail/${id}`);
//   if (!res.ok) throw new Error('SubCategory not found');
//   return res.json();
// };

// // CREATE
// export const createSubCategory = async (data: SubCategoryRequest): Promise<SubCategory> => {
//   const payload = toBackendPayload(data);
//   const res = await fetch(API_BASE_URL, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) throw new Error('Failed to create subcategory');
//   return res.json();
// };

// // UPDATE
// export const updateSubCategory = async (id: number, data: SubCategoryRequest): Promise<SubCategory> => {
//   const payload = toBackendPayload(data);
//   const res = await fetch(`${API_BASE_URL}/${id}`, {
//     method: 'PUT',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) throw new Error('Failed to update subcategory');
//   return res.json();
// };

// // Soft delete
// export const deleteSubCategory = async (id: number): Promise<void> => {
//   const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
//   if (!res.ok) throw new Error('Failed to delete subcategory');
// };

// // Hard delete
// export const hardDeleteSubCategory = async (id: number): Promise<void> => {
//   const res = await fetch(`${API_BASE_URL}/${id}/hard`, { method: 'DELETE' });
//   if (!res.ok) throw new Error('Failed to permanently delete subcategory');
// };

const API_BASE_URL = 'http://localhost:9000/api/subcategories';

import { SubCategory } from '../types';

// Frontend request shape (flattened)
export interface SubCategoryRequest {
  name: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
  discount: number;
  categoryId: number;
}

// Helper to convert frontend request to backend payload (expects category object)
const toBackendPayload = (data: SubCategoryRequest) => ({
  name: data.name,
  description: data.description || '',
  isActive: data.isActive,
  displayOrder: data.displayOrder,
  discount: data.discount,
  categoryId: data.categoryId, 
});

// GET subcategories by category ID (active only, ordered by displayOrder)
export const fetchSubCategoriesByCategory = async (categoryId: number): Promise<SubCategory[]> => {
  const res = await fetch(`${API_BASE_URL}/${categoryId}`);
  if (!res.ok) throw new Error('Failed to fetch subcategories');
  return res.json();
};

// GET single subcategory by ID
export const fetchSubCategoryById = async (id: number): Promise<SubCategory> => {
  const res = await fetch(`${API_BASE_URL}/detail/${id}`);
  if (!res.ok) throw new Error('SubCategory not found');
  return res.json();
};

// CREATE subcategory
export const createSubCategory = async (data: SubCategoryRequest): Promise<SubCategory> => {
  const payload = toBackendPayload(data);
  const res = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to create subcategory');
  return res.json();
};
export const fetchAllSubCategories = async (): Promise<SubCategory[]> => {
  const res = await fetch(API_BASE_URL);
  if (!res.ok) throw new Error('Failed to fetch subcategories');
  return res.json();
};
// UPDATE subcategory
export const updateSubCategory = async (id: number, data: SubCategoryRequest): Promise<SubCategory> => {
  const payload = toBackendPayload(data);
  const res = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Failed to update subcategory');
  return res.json();
};

// Soft delete (sets isActive=false)
export const deleteSubCategory = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete subcategory');
};

// Hard delete (permanent)
export const hardDeleteSubCategory = async (id: number): Promise<void> => {
  const res = await fetch(`${API_BASE_URL}/${id}/hard`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to permanently delete subcategory');
};