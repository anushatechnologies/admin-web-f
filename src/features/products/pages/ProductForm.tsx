import { useState, useEffect } from 'react';
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
  Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';
import { useGetStoresQuery } from '../../store/api/storeApi';
import { useGetCategoriesQuery } from '../../category/components/api/categoryApi';
import { useGetSubCategoriesByCategoryQuery } from '../../category/components/api/subCategoryApi';
import { ProductRequest, VariantRequest } from '../api/productApi';
import VariantForm from '../components/VariantForm';
import toast from 'react-hot-toast';

type Props = {
  initialData?: any;
  onSave: (data: ProductRequest, imageFile?: File) => void;
  onClose: () => void;
};

export default function ProductForm({ initialData, onSave, onClose }: Props) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isTrending, setIsTrending] = useState(initialData?.isTrending ?? false);
  
  const [bestSeller, setBestSeller] = useState(initialData?.bestSeller ?? false);
  const [displayOrder, setDisplayOrder] = useState(initialData?.displayOrder || 0);
  const [categoryId, setCategoryId] = useState<number>(initialData?.categoryId || 0);
  const [subCategoryId, setSubCategoryId] = useState<number>(initialData?.subCategoryId || 0);
  const [storeId, setStoreId] = useState<number>(initialData?.storeId || 0);
  const [variants, setVariants] = useState<VariantRequest[]>(() => {
    if (initialData?.variants) {
      return initialData.variants.map((v: any) => ({
        name: v.name,
        sku: v.sku,
        price: v.price,
        discountPrice: v.discountPrice,
        stock: v.stock,
        isActive: v.isActive,
        displayOrder: v.displayOrder,
      }));
    }
    return [
      {
        name: '',
        sku: '',
        price: 0,
        discountPrice: undefined,
        stock: 0,
        isActive: true,
        displayOrder: 1,
      },
    ];
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(initialData?.imageUrl);

  // RTK Query hooks for lookups
  const { data: storesData } = useGetStoresQuery({});
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: subCategoriesData, isFetching: loadingSubs } = useGetSubCategoriesByCategoryQuery(categoryId, {
    skip: !categoryId,
  });

  const stores = Array.isArray(storesData) ? storesData : storesData?.content || [];
  const categories = categoriesData || [];
  const subCategories = subCategoriesData || [];

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (categoryId && subCategories.length > 0) {
      if (initialData?.subCategoryId === subCategoryId) {
        // Keep it
      } else if (!subCategories.find((sc) => sc.id === subCategoryId)) {
        setSubCategoryId(0);
      }
    }
  }, [categoryId, subCategories, subCategoryId, initialData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // Validation
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
    if (variants.length === 0) {
      toast.error('At least one variant is required');
      return;
    }
    for (let i = 0; i < variants.length; i++) {
      const v = variants[i];
      if (!v.name.trim()) {
        toast.error(`Variant ${i + 1}: Name is required`);
        return;
      }
      if (!v.sku.trim()) {
        toast.error(`Variant ${i + 1}: SKU is required`);
        return;
      }
      if (v.price <= 0) {
        toast.error(`Variant ${i + 1}: Price must be greater than 0`);
        return;
      }
      if (v.stock < 0) {
        toast.error(`Variant ${i + 1}: Stock cannot be negative`);
        return;
      }
    }

    if (!initialData?.id && !imageFile) {
      toast.error('Please select an image for the product');
      return;
    }

    const productData: ProductRequest = {
      name: name.trim(),
      description: description.trim(),
      isActive,
      isTrending,
      bestSeller,
      displayOrder,
      categoryId,
      subCategoryId,
      storeId: storeId || undefined,
      variants,
    };

    setSubmitting(true);
    try {
      await onSave(productData, imageFile || undefined);
    } finally {
      setSubmitting(false);
    }
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

        <FormControl fullWidth>
          <InputLabel>Store</InputLabel>
          <Select
            value={storeId}
            onChange={(e) => setStoreId(Number(e.target.value))}
            label="Store (optional)"
          >
            <MenuItem value="">No store</MenuItem>
            {stores.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Stack direction="row" spacing={2}>
          <TextField
            label="Display Order"
            type="number"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(Number(e.target.value))}
            fullWidth
          />
        </Stack>

        <Stack direction="row" spacing={4}>
          <FormControlLabel
            control={<Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
            label="Active"
          />
          <FormControlLabel
            control={<Checkbox checked={bestSeller} onChange={(e) => setBestSeller(e.target.checked)} />}
            label="Best Seller"
          />
          <FormControlLabel
            control={<Checkbox checked={isTrending} onChange={(e) => setIsTrending(e.target.checked)} />}
            label="Trending"
          />
        </Stack>

        <VariantForm variants={variants} onChange={setVariants} />

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
              {imagePreview ? 'Change image' : 'Click to upload product image'}
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
          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? 'Saving...' : initialData?.id ? 'Update' : 'Save'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
