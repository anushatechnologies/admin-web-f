import { useState, useEffect, useCallback } from 'react';
import {
  useGetCategoriesQuery,
  useSearchCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useHardDeleteCategoryMutation,
  Category,
  CategoryRequest,
} from '../api/categoryApi';
import CategoryForm from './CategoryForm';
import ConfirmDialog from '../../../../components/ConfirmDialog';
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
} from '@mui/material';
import { Add, Edit, Delete, Search, ImageNotSupported } from '@mui/icons-material';

const ITEMS_PER_PAGE = 5;

export default function CategoryList() {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const [debouncedSearch, setDebouncedSearch] = useState(searchKeyword);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchKeyword), 500);
    return () => clearTimeout(timer);
  }, [searchKeyword]);

  // Using RTK Query hooks
  const { data: allCategories, isLoading: categoriesLoading } = useGetCategoriesQuery(undefined, {
    skip: debouncedSearch.trim().length > 0,
  });
  const { data: searchedCategories, isLoading: searchLoading } = useSearchCategoriesQuery(debouncedSearch, {
    skip: debouncedSearch.trim().length === 0,
  });

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [hardDeleteCategory] = useHardDeleteCategoryMutation();

  const loading = categoriesLoading || searchLoading;
  const categories = debouncedSearch.trim().length > 0 ? (searchedCategories || []) : (allCategories || []);

  const handleSave = async (data: CategoryRequest, imageFile?: File) => {
    try {
      if (editingCategory) {
        await updateCategory({ id: editingCategory.id, category: data, image: imageFile }).unwrap();
        toast.success('Category updated successfully');
      } else {
        await createCategory({ category: data, image: imageFile }).unwrap();
        toast.success('Category created successfully');
      }
      setShowModal(false);
      setEditingCategory(null);
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await hardDeleteCategory(id).unwrap();
      toast.success('Category deleted permanently');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to delete category');
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setShowModal(true);
  };

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const currentData = categories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4" component="h1" fontWeight="bold">
          Categories
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => {
            setEditingCategory(null);
            setShowModal(true);
          }}
        >
          Add Category
        </Button>
      </div>

      <div className="mb-4">
        <TextField
          variant="outlined"
          placeholder="Search categories by name or description..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          fullWidth
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

      {!loading && categories.length === 0 && (
        <Typography variant="body1" color="textSecondary" align="center" sx={{ my: 4 }}>
          No categories found.
        </Typography>
      )}

      {!loading && categories.length > 0 && (
        <>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Display Order</TableCell>
                  <TableCell>Discount (%)</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.map((cat) => (
                  <TableRow key={cat.id} hover>
                    <TableCell>
                      {cat.imageUrl ? (
                        <Avatar
                          src={cat.imageUrl}
                          alt={cat.name}
                          variant="rounded"
                          sx={{ width: 48, height: 48 }}
                        />
                      ) : (
                        <ImageNotSupported color="disabled" />
                      )}
                    </TableCell>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>{cat.description}</TableCell>
                    <TableCell>{cat.displayOrder}</TableCell>
                    <TableCell>{cat.discount}</TableCell>
                    <TableCell>
                      <Chip
                        label={cat.isActive ? 'Active' : 'Inactive'}
                        color={cat.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleEdit(cat)} size="small">
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => setConfirmId(cat.id)} size="small">
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
                onChange={handleChangePage}
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
          setEditingCategory(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
        <DialogContent>
          <CategoryForm
            initialData={editingCategory || undefined}
            onSave={handleSave}
            onClose={() => {
              setShowModal(false);
              setEditingCategory(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmId !== null}
        title="Delete Category"
        message="Are you sure you want to permanently delete this category?"
        onConfirm={() => {
          if (confirmId !== null) handleDelete(confirmId);
          setConfirmId(null);
        }}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
