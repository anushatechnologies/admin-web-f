import { useState, useEffect, useCallback } from 'react';
import {
  fetchProducts,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
  ProductRequest,
} from '../api/productApi';
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
} from '@mui/material';
import { Add, Edit, Delete, Search, ImageNotSupported } from '@mui/icons-material';

const ITEMS_PER_PAGE = 5;

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');

  const loadProducts = async (keyword = '') => {
    setLoading(true);
    try {
      const data = keyword.trim() ? await searchProducts(keyword) : await fetchProducts();
      setProducts(data);
      setCurrentPage(1);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((keyword: string) => {
      loadProducts(keyword);
    }, 500),
    [],
  );

  useEffect(() => {
    debouncedSearch(searchKeyword);
    return () => debouncedSearch.cancel();
  }, [searchKeyword, debouncedSearch]);

  useEffect(() => {
    loadProducts();
  }, []);

  const handleSave = async (data: ProductRequest, imageFile?: File) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data, imageFile);
        toast.success('Product updated successfully');
      } else {
        await createProduct(data, imageFile);
        toast.success('Product created successfully');
      }
      await loadProducts(searchKeyword);
      setShowModal(false);
      setEditingProduct(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete product?')) return;
    try {
      await deleteProduct(id);
      toast.success('Product deleted successfully');
      await loadProducts(searchKeyword);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const currentData = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
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
              <TableHead sx={{ bgcolor: 'grey.100' }}>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell>Discount Price</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>SubCategory</TableCell>
                  <TableCell>Store</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Trending</TableCell>
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
                    <TableCell>₹{p.price}</TableCell>
                    <TableCell>₹{p.discountPrice}</TableCell>
                    <TableCell>{p.stock}</TableCell>
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
                      <IconButton color="error" onClick={() => handleDelete(p.id)} size="small">
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
    </div>
  );
}
