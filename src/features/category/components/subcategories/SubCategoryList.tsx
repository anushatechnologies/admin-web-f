import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useGetAllSubCategoriesQuery,
  useGetSubCategoriesByCategoryQuery,
  useHardDeleteSubCategoryMutation,
} from '../api/subCategoryApi';
import { useGetCategoriesQuery } from '../api/categoryApi';
import SubCategoryForm from './SubCategoryForm';
import ConfirmDialog from '../../../../components/ConfirmDialog';
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
  Avatar,
  Link,
  Tooltip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Search,
  ImageNotSupported,
  VideoFile,
} from '@mui/icons-material';

const ITEMS_PER_PAGE = 5;

export default function SubCategoryList() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editingSub, setEditingSub] = useState<any>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(
    categoryId ? parseInt(categoryId) : 0
  );
  const [searchKeyword, setSearchKeyword] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // RTK Query hooks
  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = categoriesData || [];

  const { data: allSubCategories, isLoading: allLoading } = useGetAllSubCategoriesQuery(undefined, {
    skip: !!selectedCategoryId,
  });

  const { data: catSubCategories, isLoading: catLoading } = useGetSubCategoriesByCategoryQuery(selectedCategoryId, {
    skip: !selectedCategoryId,
  });

  const [hardDeleteSubCategory] = useHardDeleteSubCategoryMutation();

  const loading = allLoading || catLoading;
  const subCategories = selectedCategoryId ? (catSubCategories || []) : (allSubCategories || []);

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

  const handleSave = () => {
    setShowModal(false);
    setEditingSub(null);
  };

  const handleDelete = async (id: number) => {
    try {
      await hardDeleteSubCategory(id).unwrap();
      toast.success('SubCategory deleted permanently');
      setConfirmId(null);
    } catch (err: any) {
      toast.error(err.data?.message || 'Failed to delete subcategory');
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setCurrentPage(value);
  };

  return (
    <div className="p-6">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          SubCategories
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          disabled={!selectedCategoryId}
          onClick={() => {
            setEditingSub(null);
            setShowModal(true);
          }}
        >
          Add SubCategory
        </Button>
      </Box>

      {/* Filters Row */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap', alignItems: 'center' }}>
        <FormControl sx={{ minWidth: 220 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategoryId}
            onChange={(e) => {
              const catId = Number(e.target.value);
              setSelectedCategoryId(catId);
              setCurrentPage(1);
              navigate(catId ? `/subcategories/${catId}` : '/subcategories');
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

        <TextField
          variant="outlined"
          placeholder="Search subcategories by name or description..."
          value={searchKeyword}
          onChange={(e) => { setSearchKeyword(e.target.value); setCurrentPage(1); }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      {loading && (
        <div className="flex justify-center my-8">
          <CircularProgress />
        </div>
      )}

      {!loading && filteredSubCategories.length === 0 && (
        <Typography variant="body1" color="textSecondary" align="center" sx={{ my: 4 }}>
          {searchKeyword
            ? `No subcategories found for "${searchKeyword}".`
            : selectedCategoryId
            ? 'No subcategories in this category yet. Click "Add SubCategory" to create one.'
            : 'Select a category to view or create subcategories.'}
        </Typography>
      )}

      {!loading && filteredSubCategories.length > 0 && (
        <>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ bgcolor: 'var(--border-soft)' }}>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Order</TableCell>
                  <TableCell>Discount</TableCell>
                  <TableCell>Video</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentData.map((sc) => (
                  <TableRow key={sc.id} hover>
                    <TableCell>
                      {sc.imageUrl ? (
                        <Avatar
                          src={sc.imageUrl}
                          alt={sc.name}
                          variant="rounded"
                          sx={{ width: 48, height: 48 }}
                        />
                      ) : (
                        <ImageNotSupported color="disabled" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>{sc.name}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      >
                        {sc.description || '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>{sc.category?.name || sc.categoryId || '—'}</TableCell>
                    <TableCell>{sc.displayOrder}</TableCell>
                    <TableCell>
                      {sc.discount > 0 ? (
                        <Chip label={`${sc.discount}%`} size="small" color="success" />
                      ) : (
                        <Typography variant="body2" color="textSecondary">—</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {sc.videoUrl ? (
                        <Tooltip title="View video">
                          <Link href={sc.videoUrl} target="_blank" rel="noopener">
                            <VideoFile color="action" />
                          </Link>
                        </Tooltip>
                      ) : (
                        <Typography variant="body2" color="textSecondary">—</Typography>
                      )}
                    </TableCell>
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
                        size="small"
                        onClick={() => {
                          setEditingSub(sc);
                          setShowModal(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => setConfirmId(sc.id)}
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

      {/* Create/Edit Modal */}
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={confirmId !== null}
        title="Delete SubCategory"
        message="Are you sure you want to permanently delete this subcategory? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={() => confirmId && handleDelete(confirmId)}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
}
