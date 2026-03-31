import { useState } from 'react';
import { motion } from 'framer-motion';
import { useGetCategoriesQuery } from '../api/categoryApi';
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
  Paper,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  Image as ImageIcon,
  Videocam as VideocamIcon,
} from '@mui/icons-material';

type Props = {
  initialData?: any;        // includes imageUrl, videoUrl if editing
  categoryId?: number;
  onSave: () => void;        // called after successful save
  onClose: () => void;
};

const MAX_FILE_SIZE = 1048576; // 1MB - Nginx default limit

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
      if (file.size > MAX_FILE_SIZE) {
        toast.error('Image is too large! Maximum allowed size is 1MB.');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error('Video is too large! Maximum allowed size is 1MB.');
        return;
      }
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
        await updateSubCategory({ 
            id: initialData.id, 
            subCategory: requestData, 
            image: imageFile || undefined, 
            video: videoFile || undefined 
        }).unwrap();
        toast.success('SubCategory updated successfully');
      } else {
        await createSubCategory({ 
            subCategory: requestData, 
            image: imageFile || undefined, 
            video: videoFile || undefined 
        }).unwrap();
        toast.success('SubCategory created successfully');
      }
      onSave();
      onClose();
    } catch (error: any) {
      console.error('SubCategory save error:', error);
      const msg = error?.data?.message || error?.data?.error || error?.message || 'Action failed';
      toast.error(msg);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Stack spacing={3}>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
          <TextField
            label="SubCategory Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            autoFocus
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.15 }}>
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.2 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Display Order"
              type="number"
              value={displayOrder}
              onChange={(e) => setDisplayOrder(Number(e.target.value))}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Typography color="text.secondary">#</Typography>
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
            <TextField
              label="Discount (%)"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Typography color="text.secondary">%</Typography>
                  </InputAdornment>
                ),
              }}
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
            />
          </Box>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.25 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                sx={{ color: '#6366f1', '&.Mui-checked': { color: '#6366f1' } }}
              />
            }
            label={<Typography fontWeight={500}>Active SubCategory</Typography>}
          />
        </motion.div>

        {!categoryId && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.3 }}>
            <FormControl fullWidth>
              <InputLabel>Category *</InputLabel>
              <Select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                label="Category *"
                sx={{ borderRadius: 3 }}
              >
                <MenuItem value={0}>Select Category</MenuItem>
                {categories.map((cat: any) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </motion.div>
        )}

        {/* Image Upload */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.35 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 3, textAlign: 'center', borderRadius: 3, borderStyle: 'dashed', borderWidth: 2,
              borderColor: imagePreview ? 'primary.main' : 'divider',
              background: imagePreview ? 'rgba(99, 102, 241, 0.05)' : 'transparent',
              transition: 'all 0.3s ease',
            }}
          >
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} id="subcategory-image" />
            
            {imagePreview ? (
              <Box sx={{ position: 'relative', display: 'inline-block' }}>
                <img
                  src={imagePreview}
                  alt="Preview"
                  style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}
                />
                <IconButton
                  size="small"
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <label htmlFor="subcategory-image" style={{ cursor: 'pointer' }}>
                <Box sx={{ py: 2 }}>
                  <Box
                    sx={{
                      width: 64, height: 64, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto', mb: 2,
                    }}
                  >
                    <ImageIcon sx={{ color: 'white', fontSize: 32 }} />
                  </Box>
                  <Typography variant="subtitle2" fontWeight={600} color="primary">Click to upload image</Typography>
                  <Typography variant="caption" color="text.secondary">PNG, JPG up to 1MB</Typography>
                </Box>
              </label>
            )}
            {imagePreview && (
              <label htmlFor="subcategory-image">
                <Button variant="outlined" component="span" size="small" startIcon={<CloudUploadIcon />} sx={{ mt: 2, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
                  Change Image
                </Button>
              </label>
            )}
          </Paper>
        </motion.div>

        {/* Video Upload */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.4 }}>
          <Paper
            variant="outlined"
            sx={{
              p: 3, textAlign: 'center', borderRadius: 3, borderStyle: 'dashed', borderWidth: 2,
              borderColor: videoPreview ? 'secondary.main' : 'divider',
              background: videoPreview ? 'rgba(236, 72, 153, 0.05)' : 'transparent',
              transition: 'all 0.3s ease',
            }}
          >
            <input type="file" accept="video/*" onChange={handleVideoChange} style={{ display: 'none' }} id="subcategory-video" />
            
            {videoPreview ? (
              <Box sx={{ position: 'relative' }}>
                <video src={videoPreview} controls style={{ maxWidth: '100%', maxHeight: 150, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }} />
                <IconButton
                  size="small"
                  onClick={() => { setVideoFile(null); setVideoPreview(null); }}
                  sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ) : (
              <label htmlFor="subcategory-video" style={{ cursor: 'pointer' }}>
                <Box sx={{ py: 2 }}>
                  <Box
                    sx={{
                      width: 64, height: 64, borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      margin: '0 auto', mb: 2,
                    }}
                  >
                    <VideocamIcon sx={{ color: 'white', fontSize: 32 }} />
                  </Box>
                  <Typography variant="subtitle2" fontWeight={600} color="secondary">Click to upload video</Typography>
                  <Typography variant="caption" color="text.secondary">MP4, WebM up to 1MB</Typography>
                </Box>
              </label>
            )}
            {videoPreview && (
              <label htmlFor="subcategory-video">
                <Button variant="outlined" component="span" size="small" startIcon={<CloudUploadIcon />} color="secondary" sx={{ mt: 2, borderRadius: 2, textTransform: 'none', fontWeight: 600 }}>
                  Change Video
                </Button>
              </label>
            )}
          </Paper>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.45 }}>
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 600, px: 3 }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isCreating || isUpdating}
              sx={{
                borderRadius: 3, textTransform: 'none', fontWeight: 600, px: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              }}
            >
              {isCreating || isUpdating ? 'Saving...' : initialData?.id ? 'Update SubCategory' : 'Create SubCategory'}
            </Button>
          </Stack>
        </motion.div>
      </Stack>
    </Box>
  );
}
