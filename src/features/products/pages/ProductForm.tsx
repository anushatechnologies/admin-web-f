import { useState, useEffect } from 'react';
import { fetchStores, Store } from '../../store_type/api/storeapi';
import { fetchCategories, Category } from '../../category/components/api/categoryApi';
import { fetchSubCategoriesByCategory, SubCategory } from '../../category/components/api/subCategoryApi';
import { ProductRequest } from '../api/productApi';
import toast from 'react-hot-toast';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Stack,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  IconButton,
} from '@mui/material';
import { Close } from '@mui/icons-material';

type Props = {
  initialData?: any;
  onSave: (data: ProductRequest, imageFile?: File) => void;
  onClose: () => void;
};

export default function ProductForm({ initialData, onSave, onClose }: Props) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [price, setPrice] = useState(initialData?.price || 0);
  const [discountPrice, setDiscountPrice] = useState(initialData?.discountPrice || 0);
  const [stock, setStock] = useState(initialData?.stock || 0);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isTrending, setIsTrending] = useState(initialData?.isTrending ?? false);
  const [displayOrder, setDisplayOrder] = useState(initialData?.displayOrder || 0);
  const [categoryId, setCategoryId] = useState<number>(initialData?.category?.id || 0);
  const [subCategoryId, setSubCategoryId] = useState<number>(initialData?.subCategory?.id || 0);
  const [storeId, setStoreId] = useState<number>(initialData?.store?.id || 0);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(initialData?.imageUrl);

  const [stores, setStores] = useState<Store[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  useEffect(() => {
    Promise.all([fetchStores(), fetchCategories()])
      .then(([storesData, catsData]) => {
        setStores(storesData.content || []);
        setCategories(catsData);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (categoryId) {
      setLoadingSubs(true);
      fetchSubCategoriesByCategory(categoryId)
        .then(setSubCategories)
        .catch(console.error)
        .finally(() => setLoadingSubs(false));
    } else {
      setSubCategories([]);
    }
    setSubCategoryId(0);
  }, [categoryId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!categoryId) {
      toast.error('Please select a category');
      return;
    }
    if (!subCategoryId) {
      toast.error('Please select a subcategory');
      return;
    }
    if (!initialData?.id && !imageFile) {
      toast.error('Please select an image for the product');
      return;
    }

    const productData: ProductRequest = {
      name: name.trim(),
      description: description.trim(),
      price,
      discountPrice,
      stock,
      isActive,
      isTrending,
      displayOrder,
      categoryId,
      subCategoryId,
      storeId: storeId || undefined,
    };

    onSave(productData, imageFile || undefined);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Stack spacing={3}>
        <TextField
          label="Product Name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          autoFocus
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={3}
        />
        <Stack direction="row" spacing={2}>
          <TextField
            label="Price (₹) *"
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            fullWidth
          />
          <TextField
            label="Discount Price (₹)"
            type="number"
            step="0.01"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(Number(e.target.value))}
            fullWidth
          />
        </Stack>
        <Stack direction="row" spacing={2}>
          <TextField
            label="Stock *"
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            fullWidth
          />
          <TextField
            label="Display Order"
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            fullWidth
          />
        </Stack>

        <FormControl fullWidth>
          <InputLabel>Store (optional)</InputLabel>
          <Select
            value={storeId}
            onChange={(e) => setStoreId(Number(e.target.value))}
            label="Store (optional)"
          >
            <MenuItem value="">Select a store</MenuItem>
            {stores.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Category *</InputLabel>
          <Select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            label="Category *"
          >
            <MenuItem value="">Select a category</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth disabled={!categoryId}>
          <InputLabel>SubCategory *</InputLabel>
          <Select
            value={subCategoryId}
            onChange={(e) => setSubCategoryId(Number(e.target.value))}
            label="SubCategory *"
          >
            <MenuItem value="">
              {loadingSubs ? 'Loading...' : 'Select a subcategory'}
            </MenuItem>
            {subCategories.map((sc) => (
              <MenuItem key={sc.id} value={sc.id}>
                {sc.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            }
            label="Active"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={isTrending}
                onChange={(e) => setIsTrending(e.target.checked)}
              />
            }
            label="Trending"
          />
        </Stack>

        <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            id="product-image"
          />
          <label htmlFor="product-image">
            <Button variant="outlined" component="span">
              {imagePreview ? 'Change image' : 'Click to upload image'}
            </Button>
          </label>
          {imagePreview && (
            <Box sx={{ mt: 2, position: 'relative', display: 'inline-block' }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: 128, height: 128, objectFit: 'cover', borderRadius: 8 }}
              />
              <IconButton
                size="small"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(undefined);
                }}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  bgcolor: 'error.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'error.dark' },
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Paper>

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {initialData?.id ? 'Update' : 'Save'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}