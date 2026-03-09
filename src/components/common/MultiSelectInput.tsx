import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  FormHelperText,
  OutlinedInput,
  SelectChangeEvent,
} from '@mui/material';

interface MultiSelectInputProps {
  label?: string;
  value: string[];
  onChange?: (selected: string[]) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  options: { value: string; label: string }[];
  errorText?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  name?: string;
  showSelectAll?: boolean;
}

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  label,
  value,
  onChange,
  onBlur,
  options,
  errorText,
  variant = 'outlined',
  fullWidth = true,
  size = 'small',
  showSelectAll = false,
}) => {
  const SELECT_ALL_VALUE = '__select_all__';

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    if (!onChange) return;

    const selected = event.target.value as string[];

    // Check if "Select All" was clicked
    if (selected.includes(SELECT_ALL_VALUE)) {
      // If all options were already selected, deselect all
      if (value.length === options.length) {
        onChange([]);
      } else {
        // Otherwise, select all options
        onChange(options.map((o) => o.value));
      }
    } else {
      onChange(selected);
    }
  };

  const allSelected = value.length === options.length && options.length > 0;
  const someSelected = value.length > 0 && value.length < options.length;

  return (
    <FormControl fullWidth={fullWidth} variant={variant} size={size} error={!!errorText}>
      {label && <InputLabel>{label}</InputLabel>}

      <Select
        multiple
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        input={<OutlinedInput label={label} />}
        renderValue={(selected) =>
          (selected as string[])
            .map((val) => options.find((o) => o.value === val)?.label || val)
            .join(', ')
        }
      >
        {showSelectAll && (
          <MenuItem value={SELECT_ALL_VALUE}>
            <Checkbox checked={allSelected} indeterminate={someSelected} />
            <ListItemText primary="Select All" />
          </MenuItem>
        )}

        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            <Checkbox checked={value.includes(option.value)} />
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Select>

      {errorText && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl>
  );
};

export default MultiSelectInput;
