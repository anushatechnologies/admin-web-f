import { baseApiWithAuth } from '@api/baseApi';
import { Category } from '../../types/index';
export type { Category };

export type CategoryRequest = Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'imageUrl'>;

export const categoryApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    // 3.1 Get All Categories
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Category' as any], // We'll add 'Category' to baseApi tagTypes soon
    }),

    // 3.2 Get Category by ID
    getCategoryById: builder.query<Category, number>({
      query: (id) => `/categories/${id}`,
      providesTags: (result, error, id) => [{ type: 'Category' as any, id }],
    }),

    // 3.3 Create Category
    createCategory: builder.mutation<Category, { category: CategoryRequest; image?: File }>({
      query: ({ category, image }) => {
        const formData = new FormData();
        formData.append('category', new Blob([JSON.stringify(category)], { type: 'application/json' }));
        if (image) formData.append('image', image);
        return {
          url: '/categories',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Category' as any],
    }),

    // 3.4 Update Category
    updateCategory: builder.mutation<Category, { id: number; category: CategoryRequest; image?: File }>({
      query: ({ id, category, image }) => {
        const formData = new FormData();
        formData.append('category', new Blob([JSON.stringify(category)], { type: 'application/json' }));
        if (image) formData.append('image', image);
        return {
          url: `/categories/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => ['Category' as any, { type: 'Category' as any, id }],
    }),

    // 3.5 Soft Delete
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category' as any],
    }),

    // 3.6 Hard Delete
    hardDeleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/categories/${id}/hard`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Category' as any],
    }),

    // 3.7 Search Categories
    searchCategories: builder.query<Category[], string>({
      query: (keyword) => `/categories/search?keyword=${encodeURIComponent(keyword)}`,
      providesTags: ['Category' as any],
    }),

    // 3.8 Filter by Discount
    filterCategoriesByDiscount: builder.query<Category[], number>({
      query: (minDiscount) => `/categories/filter/discount?minDiscount=${minDiscount}`,
      providesTags: ['Category' as any],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useHardDeleteCategoryMutation,
  useSearchCategoriesQuery,
  useFilterCategoriesByDiscountQuery,
} = categoryApi;
