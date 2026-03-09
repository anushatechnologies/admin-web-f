import React from 'react';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  SelectChangeEvent,
} from '@mui/material';

interface SelectInputProps {
  label?: string;
  value?: string | number;
  onChange?: (event: SelectChangeEvent<string | number>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  options: { value: string | number; label: string }[];
  errorText?: string;
  variant?: 'outlined' | 'filled' | 'standard';
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  name?: string;
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value = '',
  onChange,
  onBlur,
  options,
  errorText,
  variant = 'outlined',
  fullWidth = true,
  size = 'small',
  name,
}) => {
  return (
    <FormControl fullWidth={fullWidth} variant={variant} size={size} error={Boolean(errorText)}>
      {label && <InputLabel>{label}</InputLabel>}

      <Select label={label} value={value} onChange={onChange} onBlur={onBlur} name={name}>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>

      {errorText && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl>
  );
};

export default SelectInput;
