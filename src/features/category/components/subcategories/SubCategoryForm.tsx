import { useState, useEffect } from 'react';
import { fetchCategories, Category } from '../api/categoryApi';
import { SubCategoryRequest } from '../api/subCategoryApi';
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
} from '@mui/material';

type Props = {
  initialData?: any;
  categoryId?: number;
  onSave: (data: SubCategoryRequest) => void;
  onClose: () => void;
};

export default function SubCategoryForm({ initialData, categoryId, onSave, onClose }: Props) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [displayOrder, setDisplayOrder] = useState(initialData?.displayOrder || 0);
  const [discount, setDiscount] = useState(initialData?.discount || 0);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(
    initialData?.category?.id || categoryId || 0,
  );
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (!categoryId) {
      fetchCategories()
        .then(setCategories)
        .catch((err) => console.error('Failed to load categories', err));
    }
  }, [categoryId]);

  const handleSubmit = (e: React.FormEvent) => {
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
    onSave({
      name: name.trim(),
      description: description.trim(),
      isActive,
      displayOrder,
      discount,
      categoryId: finalCategoryId,
    });
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
          step="0.01"
          value={discount}
          onChange={(e) => setDiscount(Number(e.target.value))}
          fullWidth
        />
        <FormControlLabel
          control={<Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />}
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

        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
