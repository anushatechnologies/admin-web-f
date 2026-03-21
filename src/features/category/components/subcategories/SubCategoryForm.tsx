import { useState } from 'react';
import { useGetCategoriesQuery, Category } from '../api/categoryApi';
import { SubCategoryRequest, useCreateSubCategoryMutation, useUpdateSubCategoryMutation } from '../api/subCategoryApi';
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
  Typography,
  CircularProgress
} from '@mui/material';
import { CloudUpload } from '@mui/icons-material';

type Props = {
  initialData?: any;        // includes imageUrl, videoUrl if editing
  categoryId?: number;
  onSave: () => void;        // called after successful save
  onClose: () => void;
};

export default function SubCategoryForm({ initialData, categoryId, onSave, onClose }: Props) {
  const [createSubCategory, { isLoading: isCreating }] = useCreateSubCategoryMutation();
  const [updateSubCategory, { isLoading: isUpdating }] = useUpdateSubCategoryMutation();

  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [displayOrder, setDisplayOrder] = useState(initialData?.displayOrder || 0);
  const [discount, setDiscount] = useState(initialData?.discount || 0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(
    initialData?.category?.id || categoryId || 0
  );

  // RTK Query for Categories (if not passed as categoryId)
  const { data: categoriesData } = useGetCategoriesQuery(undefined, {
    skip: !!categoryId
  });
  const categories = categoriesData || [];

  // File states
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null);
  const [videoPreview, setVideoPreview] = useState<string | null>(initialData?.videoUrl || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
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
    if (!name.trim()) {
      toast.error('Name is required');
      return;
    }
    const finalCategoryId = categoryId || selectedCategoryId;
    if (!finalCategoryId) {
      toast.error('Please select a category');
      return;
    }

    const requestData: SubCategoryRequest = {
      name: name.trim(),
      description: description.trim(),
      isActive,
      displayOrder,
      discount,
      categoryId: finalCategoryId,
    };

    try {
      if (initialData) {
        // Update
        await updateSubCategory({ 
            id: initialData.id, 
            subCategory: requestData, 
            image: imageFile || undefined, 
            video: videoFile || undefined 
        }).unwrap();
        toast.success('SubCategory updated successfully');
      } else {
        // Create
        await createSubCategory({ 
            subCategory: requestData, 
            image: imageFile || undefined, 
            video: videoFile || undefined 
        }).unwrap();
        toast.success('SubCategory created successfully');
      }
      onSave(); // trigger refresh in parent
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.message || error.message || 'Action failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Stack spacing={3}>
        <TextField
          label="Name *"
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
          rows={2}
        />
        <TextField
          label="Display Order"
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(Number(e.target.value))}
          fullWidth
        />
        <TextField
          label="Discount %"
          type="number"
          inputProps={{ step: '0.01' }}
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          fullWidth
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
          }
          label="Active"
        />

        {!categoryId && (
          <FormControl fullWidth>
            <InputLabel>Category *</InputLabel>
            <Select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
              label="Category *"
            >
              <MenuItem value="">Select Category</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {/* Image Upload */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>Image</Typography>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUpload />}
          >
            Upload Image
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </Button>
          {imagePreview && (
            <Box mt={1}>
              <img src={imagePreview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '150px' }} />
            </Box>
          )}
        </Box>

        {/* Video Upload */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>Video</Typography>
          <Button
            variant="outlined"
            component="label"
            startIcon={<CloudUpload />}
          >
            Upload Video
            <input type="file" hidden accept="video/*" onChange={handleVideoChange} />
          </Button>
          {videoPreview && (
            <Box mt={1}>
              <video src={videoPreview} controls style={{ maxWidth: '100%', maxHeight: '150px' }} />
            </Box>
          )}
        </Box>

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={isCreating || isUpdating}>
            {(isCreating || isUpdating) ? <CircularProgress size={24} color="inherit" /> : 'Save'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
