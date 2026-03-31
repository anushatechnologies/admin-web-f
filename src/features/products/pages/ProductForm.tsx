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
import { Close, AddPhotoAlternate, Movie } from '@mui/icons-material';


import { useGetStoresQuery } from '../../store/api/storeApi';
import { useGetCategoriesQuery } from '../../category/components/api/categoryApi';
import { useGetSubCategoriesByCategoryQuery } from '../../category/components/api/subCategoryApi';
import { ProductRequest, VariantRequest } from '../api/productApi';
import VariantForm from '../components/VariantForm';
import toast from 'react-hot-toast';

type Props = {
  initialData?: any;
  onSave: (data: ProductRequest, imageFile?: File, galleryImages?: File[], videoFile?: File) => void;
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

  // Gallery Images
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>(
    initialData?.images?.map((img: any) => img.imageUrl) || []
  );

  // Video
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | undefined>(initialData?.videoUrl);



  // RTK Query hooks for lookups
  const { data: storesData } = useGetStoresQuery(undefined as any);
  const { data: categoriesData } = useGetCategoriesQuery();
  const { data: subCategoriesData, isFetching: loadingSubs } = useGetSubCategoriesByCategoryQuery(categoryId, {
    skip: !categoryId,
  });

  const stores = Array.isArray(storesData) ? storesData : (storesData as any)?.content || [];
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

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setGalleryImages((prev) => [...prev, ...files]);
      const newPreviews = files.map((f) => URL.createObjectURL(f));
      setGalleryPreviews((prev) => [...prev, ...newPreviews]);
      toast.success(`${files.length} gallery image(s) added`);
    }
  };


  const removeGalleryImage = (index: number) => {
    // If it's a new file
    const fileIndex = index - (initialData?.images?.length || 0);
    if (fileIndex >= 0) {
      setGalleryImages((prev) => prev.filter((_, i) => i !== fileIndex));
    }
    setGalleryPreviews((prev) => prev.filter((_, i) => i !== index));
    // Note: Deleting existing images from backend should be handled separately or via update
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
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
      await onSave(productData, imageFile || undefined, galleryImages, videoFile || undefined);
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
            {stores.map((s: any) => (
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

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
            Product Images ({ (imagePreview ? 1 : 0) + galleryPreviews.length })
          </Typography>

          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              {/* Main Image Preview */}
              {imagePreview && (
                <Box sx={{ position: 'relative', width: 120, height: 120, border: '2px solid', borderColor: 'primary.main', borderRadius: 2 }}>
                  <img
                    src={imagePreview}
                    alt="Main"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }}
                  />
                  <Typography
                    variant="caption"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      textAlign: 'center',
                      fontSize: '0.65rem',
                      fontWeight: 'bold',
                      borderBottomLeftRadius: 4,
                      borderBottomRightRadius: 4,
                    }}
                  >
                    MAIN
                  </Typography>
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

              {/* Gallery Previews */}
              {galleryPreviews.map((preview, index) => (
                <Box key={index} sx={{ position: 'relative', width: 100, height: 100, mt: 1 }}>
                  <img
                    src={preview}
                    alt={`Gallery ${index}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 8 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => removeGalleryImage(index)}
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
              ))}
              
              <Box sx={{ mt: imagePreview ? 1 : 0 }}>
                <Stack direction="row" spacing={2}>
                  {/* Main Image Upload */}
                  {!imagePreview && (
                    <Box>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        id="main-image-upload"
                      />
                      <label htmlFor="main-image-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          sx={{
                            width: 120,
                            height: 120,
                            borderStyle: 'dashed',
                            borderWidth: 2,
                            borderColor: 'primary.main',
                            borderRadius: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1,
                            textTransform: 'none',
                          }}
                        >
                          <AddPhotoAlternate />
                          <Typography variant="caption">Main Image</Typography>
                        </Button>
                      </label>
                    </Box>
                  )}

                  {/* Gallery Upload Button */}
                  <Box>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryChange}
                      style={{ display: 'none' }}
                      id="gallery-images-upload"
                    />
                    <label htmlFor="gallery-images-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        sx={{
                          width: 100,
                          height: 100,
                          borderStyle: 'dashed',
                          borderWidth: 2,
                          borderColor: 'secondary.main',
                          borderRadius: 2,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 1,
                          textTransform: 'none',
                        }}
                      >
                        <AddPhotoAlternate />
                        <Typography variant="caption">Add Gallery</Typography>
                      </Button>
                    </label>
                  </Box>
                </Stack>
              </Box>
            </Box>
          </Paper>
        </Box>


        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
            Product Video
          </Typography>
          <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper', textAlign: 'center' }}>
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoChange}
              style={{ display: 'none' }}
              id="product-video-upload"
            />
            <label htmlFor="product-video-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<Movie />}
                sx={{ borderRadius: 2 }}
              >
                {videoPreview ? 'Change Video' : 'Upload Product Video'}
              </Button>
            </label>
            {videoPreview && (
              <Box sx={{ mt: 2, position: 'relative', display: 'inline-block', maxWidth: '100%' }}>
                <video
                  src={videoPreview}
                  controls
                  style={{ width: '100%', maxHeight: 240, borderRadius: 8 }}
                />
                <IconButton
                  size="small"
                  onClick={() => {
                    setVideoFile(null);
                    setVideoPreview(undefined);
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
        </Box>



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
