import { baseApiWithAuth } from '@api/baseApi';
import { Product } from '../../category/types/index';

export interface ProductVariantRequest {
  name: string;
  sku: string; // added sku
  price: number;
  discountPrice?: number;
  stock: number;
  isActive: boolean;
  displayOrder: number;
}
export type VariantRequest = ProductVariantRequest;

export interface ProductRequest {
  name: string;
  description: string;
  isActive: boolean;
  isTrending?: boolean;
  bestSeller?: boolean;
  displayOrder: number;
  categoryId: number;
  subCategoryId: number;
  storeId?: number; // Optional
  variants: ProductVariantRequest[];
}

export const productApi = baseApiWithAuth.injectEndpoints({
  endpoints: (builder) => ({
    // 5.1 Get All Products
    getProducts: builder.query<Product[], { storeId?: number }>({
      query: (params) => ({
        url: '/products',
        params,
      }),
      providesTags: ['Product' as any],
    }),

    // 5.2 Get Product by ID
    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product' as any, id }],
    }),

    // 5.3 Create Product
    createProduct: builder.mutation<Product, { product: ProductRequest; image?: File; video?: File }>({
      query: ({ product, image, video }) => {
        const formData = new FormData();
        formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
        if (image) formData.append('image', image);
        if (video) formData.append('video', video);
        return {
          url: '/products',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Product' as any],
    }),

    // 5.4 Update Product
    updateProduct: builder.mutation<Product, { id: number; product: ProductRequest; image?: File; video?: File }>({
      query: ({ id, product, image, video }) => {
        const formData = new FormData();
        formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
        if (image) formData.append('image', image);
        if (video) formData.append('video', video);
        return {
          url: `/products/${id}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { id }) => ['Product' as any, { type: 'Product' as any, id }],
    }),


    // 5.5 Delete Product
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product' as any],
    }),

    // 5.6 Search Products
    searchProducts: builder.query<Product[], string>({
      query: (keyword) => `/products/search?keyword=${encodeURIComponent(keyword)}`,
      providesTags: ['Product' as any],
    }),

    // 5.7 Get Trending Products
    getTrendingProducts: builder.query<Product[], void>({
      query: () => '/products/trending',
      providesTags: ['Product' as any],
    }),

    // 5.8 Filter Products
    filterProducts: builder.query<Product[], {
      categoryId?: number;
      subCategoryId?: number;
      storeId?: number;
      minPrice?: number;
      maxPrice?: number;
      trending?: boolean;
      keyword?: string;
    }>({
      query: (params) => ({
        url: '/products/filter',
        params,
      }),
      providesTags: ['Product' as any],
    }),

    // Gallery Images
    addGalleryImage: builder.mutation<any, { productId: number; image: File; displayOrder: number }>({
      query: ({ productId, image, displayOrder }) => {
        const formData = new FormData();
        formData.append('image', image);
        formData.append('displayOrder', displayOrder.toString());
        return {
          url: `/products/${productId}/images`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product' as any, id: productId }],
    }),

    updateGalleryImage: builder.mutation<any, { imageId: number; image?: File; displayOrder?: number }>({
      query: ({ imageId, image, displayOrder }) => {
        const formData = new FormData();
        if (image) formData.append('image', image);
        if (displayOrder !== undefined) formData.append('displayOrder', displayOrder.toString());
        return {
          url: `/products/images/${imageId}`,
          method: 'PUT',
          body: formData,
        };
      },
      invalidatesTags: ['Product' as any],
    }),

    deleteGalleryImage: builder.mutation<void, { imageId: number; productId: number }>({
      query: ({ imageId }) => ({
        url: `/products/images/${imageId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: 'Product' as any, id: productId }],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useSearchProductsQuery,
  useGetTrendingProductsQuery,
  useFilterProductsQuery,
  useAddGalleryImageMutation,
  useUpdateGalleryImageMutation,
  useDeleteGalleryImageMutation,
} = productApi;

