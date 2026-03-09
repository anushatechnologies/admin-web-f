import { useState } from 'react';
import { CategoryRequest } from '../../api/categoryApi';
import toast from 'react-hot-toast';
import {
  TextField,
  Checkbox,
  FormControlLabel,
  Button,
  Stack,
  Box,
  IconButton,
  Paper,
} from '@mui/material';
import { Close } from '@mui/icons-material';

type Props = {
  initialData?: CategoryRequest & { id?: number; imageUrl?: string };
  onSave: (data: CategoryRequest, imageFile?: File) => void;
  onClose: () => void;
};

export default function CategoryForm({ initialData, onSave, onClose }: Props) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [displayOrder, setDisplayOrder] = useState(initialData?.displayOrder || 0);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [discount, setDiscount] = useState(initialData?.discount || 0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(initialData?.imageUrl);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    onSave(
      {
        name: name.trim(),
        description: description.trim(),
        displayOrder,
        isActive,
        discount,
        imageUrl: initialData?.imageUrl,
        videoUrl: initialData?.videoUrl,
      },
      imageFile || undefined
    );
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
          rows={3}
        />
        <TextField
          label="Display Order"
          type="number"
          value={displayOrder}
          onChange={(e) => setDisplayOrder(Number(e.target.value))}
          fullWidth
        />
        <TextField
          label="Discount (%)"
          type="number"
          step="0.01"
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

        <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
            id="category-image"
          />
          <label htmlFor="category-image">
            <Button variant="outlined" component="span">
              {imagePreview ? 'Change image' : 'Click to upload image'}
            </Button>
          </label>
          {imagePreview && (
            <Box sx={{ mt: 2, position: 'relative', display: 'inline-block' }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{ width: 96, height: 96, objectFit: 'cover', borderRadius: 8 }}
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
          <Button type="submit" variant="contained" disabled={uploading}>
            {uploading ? 'Uploading...' : 'Save'}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}