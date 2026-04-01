import { useState, useEffect, useCallback } from 'react';
import {
  useGetProductsQuery,
  useSearchProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useAddGalleryImageMutation,
} from '../api/productApi';

import { ProductRequest } from '../api/productApi';
import { Product } from '../../category/types/index';
import ProductForm from './ProductForm';
import debounce from 'lodash/debounce';
import toast from 'react-hot-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  CircularProgress,
  Pagination,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Chip,
  Avatar,
  Box,
  Tooltip,
} from '@mui/material';
import { Add, Edit, Delete, Search, ImageNotSupported } from '@mui/icons-material';
import ConfirmDialog from '../../../components/ConfirmDialog';

const ITEMS_PER_PAGE = 5;

export default function ProductList() {
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  const [debouncedSearch, setDebouncedSearch] = useState(searchKeyword);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchKeyword), 500);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // Using RTK Query hooks
  const { data: allProducts, isLoading: productsLoading } = useGetProductsQuery({});
  const { data: searchedProducts, isLoading: searchLoading } = useSearchProductsQuery(debouncedSearch, {
    skip: debouncedSearch.trim().length === 0,
  });

  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [addGalleryImage] = useAddGalleryImageMutation();


  const loading = productsLoading || searchLoading;
  const products = debouncedSearch.trim().length > 0 ? (searchedProducts || []) : (allProducts || []);

  const handleSave = async (data: ProductRequest, imageFile?: File, galleryImages?: File[], videoFile?: File) => {
    try {
      let product: Product;
      if (editingProduct) {
        product = await updateProduct({ id: editingProduct.id, product: data, image: imageFile, video: videoFile }).unwrap();
        toast.success('Product updated successfully');
      } else {
        product = await createProduct({ product: data, image: imageFile, video: videoFile }).unwrap();
        toast.success('Product created successfully');
      }


      // Handle Gallery Images
      if (galleryImages && galleryImages.length > 0) {
        toast.loading('Uploading gallery images...', { id: 'gallery-upload' });
        try {
          const uploadPromises = galleryImages.map((file, index) =>
            addGalleryImage({
              productId: product.id,
              image: file,
              displayOrder: (product.images?.length || 0) + index + 1,
            }).unwrap()
          );
          await Promise.all(uploadPromises);
          toast.success('Gallery images uploaded successfully', { id: 'gallery-upload' });
        } catch (error) {
          toast.error('Failed to upload some gallery images', { id: 'gallery-upload' });
        }
      }

      setSearchKeyword('');           // clear search
      setShowModal(false);
      setEditingProduct(null);
    } catch (error: any) {
      let errorMsg = error.data?.message || 'Failed to save product';
      if (typeof errorMsg === 'string' && errorMsg.includes('foreign key constraint fails') && errorMsg.includes('order_items')) {
        errorMsg = 'Cannot delete or modify variant because it is associated with existing orders.';
      }
      toast.error(errorMsg);
    }
  };


  const handleConfirmDelete = async () => {
    if (productToDelete === null) return;
    try {
      await deleteProduct(productToDelete).unwrap();
      toast.success('Product deleted successfully');
    } catch (error: any) {
      let errorMsg = error.data?.message || 'Failed to delete product';
      if (typeof errorMsg === 'string' && errorMsg.includes('foreign key constraint fails') && errorMsg.includes('order_items')) {
        errorMsg = 'Cannot delete product because it is associated with existing orders.';
      }
      toast.error(errorMsg);
    } finally {
      setDeleteConfirmOpen(false);
      setProductToDelete(null);
    }
  };

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const currentData = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <div className="p-6">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Products
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
        >
          Add Product
        </Button>
      </Box>

      <div className="mb-4">
        <TextField
          variant="outlined"
          placeholder="Search products by name or description..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </div>

      {loading && (
        <div className="flex justify-center my-8">
          <CircularProgress />
        </div>
      )}

      {!loading && products.length === 0 && (
        <Typography variant="body1" color="textSecondary" align="center" sx={{ my: 4 }}>
          No products found.
        </Typography>
      )}

      {!loading && products.length > 0 && (
        <>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ bgcolor: 'var(--border-soft)' }}>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Variants</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>SubCategory</TableCell>
                  <TableCell>Store</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Trending</TableCell>
                  <TableCell>Best Seller</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell>
                      {p.imageUrl ? (
                        <Avatar
                          src={p.imageUrl}
                          alt={p.name}
                          variant="rounded"
                          sx={{ width: 48, height: 48 }}
                        />
                      ) : (
                        <ImageNotSupported color="disabled" />
                      )}
                    </TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>
                      <Tooltip title={p.variants?.map(v => v.name).join(', ') || 'No variants'}>
                        <Chip
                          label={`${p.variants?.length || 0} variant${p.variants?.length !== 1 ? 's' : ''}`}
                          size="small"
                          color="primary"
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell>{p.categoryName || p.categoryId}</TableCell>
                    <TableCell>{p.subCategoryName || p.subCategoryId}</TableCell>
                    <TableCell>{p.storeName || p.storeId}</TableCell>
                    <TableCell>
                      <Chip
                        label={p.isActive ? 'Yes' : 'No'}
                        color={p.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.isTrending ? 'Yes' : 'No'}
                        color={p.isTrending ? 'info' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.bestSeller ? 'Yes' : 'No'}
                        color={p.bestSeller ? 'secondary' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setEditingProduct(p);
                          setShowModal(true);
                        }}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setProductToDelete(p.id);
                          setDeleteConfirmOpen(true);
                        }}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </div>
          )}
        </>
      )}

      <Dialog
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingProduct(null);
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <ProductForm
            initialData={editingProduct || undefined}
            onSave={handleSave}
            onClose={() => {
              setShowModal(false);
              setEditingProduct(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Delete Product"
        message="Are you sure you want to delete this product? This will also delete all its variants and cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setProductToDelete(null);
        }}
      />
    </div>
  );
}
