import { useState, useEffect, useCallback } from 'react';
import {
  fetchCategories,
  searchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  Category,
  CategoryRequest,
} from '../api/categoryApi';
import { hardDeleteCategory } from '../api/categoryApi';
import CategoryForm from './CategoryForm';
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
import {
  Add,
  Edit,
  Delete,
  Search,
  ImageNotSupported,
} from '@mui/icons-material';

const ITEMS_PER_PAGE = 5;

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');

  const loadCategories = async (keyword = '') => {
    setLoading(true);
    try {
      const data = keyword.trim()
        ? await searchCategories(keyword)
        : await fetchCategories();
      setCategories(data);
      setCurrentPage(1);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = useCallback(
    debounce((keyword: string) => {
      loadCategories(keyword);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSearch(searchKeyword);
    return () => debouncedSearch.cancel();
  }, [searchKeyword, debouncedSearch]);

  useEffect(() => {
    loadCategories();
  }, []);

  const handleSave = async (data: CategoryRequest, imageFile?: File) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data, imageFile);
        toast.success('Category updated successfully');
      } else {
        await createCategory(data, imageFile);
        toast.success('Category created successfully');
      }
      await loadCategories(searchKeyword);
      setShowModal(false);
      setEditingCategory(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

const handleDelete = async (id: number) => {
  if (!confirm('Are you sure you want to permanently delete this category?')) return;
  try {
    await hardDeleteCategory(id);               // <-- use hard delete
    toast.success('Category deleted permanently');
    await loadCategories(searchKeyword);
  } catch (error: any) {
    toast.error(error.message);
  }
};

  const handleEdit = (cat: Category) => {
    setEditingCategory(cat);
    setShowModal(true);
  };

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const currentData = categories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
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
              <TableHead sx={{ bgcolor: 'grey.100' }}>
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
                      <IconButton
                        color="primary"
                        onClick={() => handleEdit(cat)}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(cat.id)}
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
        <DialogTitle>
          {editingCategory ? 'Edit Category' : 'Add Category'}
        </DialogTitle>
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
    </div>
  );
}