import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hardDeleteSubCategory } from '../api/subCategoryApi';
import { fetchAllSubCategories } from '../api/subCategoryApi';
import {
  fetchSubCategoriesByCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  SubCategoryRequest,
} from '../api/subCategoryApi';
import { fetchCategories, Category } from '../api/categoryApi';
import SubCategoryForm from './SubCategoryForm';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { Add, Edit, Delete, Search } from '@mui/icons-material';

const ITEMS_PER_PAGE = 5;

export default function SubCategoryList() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingSub, setEditingSub] = useState<any>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(0);
  // const [selectedCategoryId, setSelectedCategoryId] = useState<number>(
  //   categoryId ? parseInt(categoryId) : 0
  // );
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch((err) => console.error('Failed to load categories', err));
  }, []);

  useEffect(() => {
    if (selectedCategoryId) {
      loadSubCategories(selectedCategoryId);
    } else {
      loadAllSubCategories();
    }
  }, [selectedCategoryId]);
  const loadAllSubCategories = async () => {
    setLoading(true);
    try {
      const data = await fetchAllSubCategories();
      setSubCategories(data);
      setCurrentPage(1);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  const loadSubCategories = async (catId: number) => {
    setLoading(true);
    try {
      const data = await fetchSubCategoriesByCategory(catId);
      setSubCategories(data);
      setCurrentPage(1);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredSubCategories = subCategories.filter(sc =>
    searchKeyword
      ? sc.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (sc.description && sc.description.toLowerCase().includes(searchKeyword.toLowerCase()))
      : true
  );

  const totalPages = Math.ceil(filteredSubCategories.length / ITEMS_PER_PAGE);
  const currentData = filteredSubCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSave = async (formData: SubCategoryRequest) => {
    try {
      if (editingSub) {
        await updateSubCategory(editingSub.id, formData);
        toast.success('SubCategory updated successfully');
      } else {
        await createSubCategory(formData);
        toast.success('SubCategory created successfully');
      }
      await loadSubCategories(selectedCategoryId);
      setShowModal(false);
      setEditingSub(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async (id: number) => {
    console.log('Deleting subcategory with id', id); // <-- add this
    if (!confirm('Delete this subcategory permanently?')) return;
    try {
      await hardDeleteSubCategory(id);
      toast.success('SubCategory deleted permanently');
      await loadSubCategories(selectedCategoryId);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <div className="p-6">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          SubCategories
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategoryId}
              onChange={(e) => {
                const catId = Number(e.target.value);
                setSelectedCategoryId(catId);
                navigate(`/subcategories/${catId}`);
              }}
              label="Category"
            >
              <MenuItem value={0}>All Categories</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={() => {
              setEditingSub(null);
              setShowModal(true);
            }}
            disabled={!selectedCategoryId}
          >
            Add SubCategory
          </Button>
        </Box>
      </Box>

      <div className="mb-4">
        <TextField
          variant="outlined"
          placeholder="Filter subcategories..."
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

      {!loading && filteredSubCategories.length === 0 && (
        <Typography variant="body1" color="textSecondary" align="center" sx={{ my: 4 }}>
          No subcategories found.
        </Typography>
      )}

      {!loading && filteredSubCategories.length > 0 && (
        <>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ bgcolor: 'grey.100' }}>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Display Order</TableCell>
                  <TableCell>Discount (%)</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.map((sc) => (
                  <TableRow key={sc.id} hover>
                    <TableCell>{sc.name}</TableCell>
                    <TableCell>{sc.description}</TableCell>
                    <TableCell>{sc.displayOrder}</TableCell>
                    <TableCell>{sc.discount}</TableCell>
                    <TableCell>
                      <Chip
                        label={sc.isActive ? 'Active' : 'Inactive'}
                        color={sc.isActive ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setEditingSub(sc);
                          setShowModal(true);
                        }}
                        size="small"
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(sc.id)}
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
          setEditingSub(null);
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{editingSub ? 'Edit SubCategory' : 'Add SubCategory'}</DialogTitle>
        <DialogContent>
          <SubCategoryForm
            initialData={editingSub || undefined}
            categoryId={selectedCategoryId}
            onSave={handleSave}
            onClose={() => {
              setShowModal(false);
              setEditingSub(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}