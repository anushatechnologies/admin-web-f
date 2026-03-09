import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { Stack } from '@mui/material';

interface FormattedNumberInputProps {
  value?: string | number | null;
  setValue?: (value: string | number) => void;
  onChange?: (value: string | number) => void;
  label?: string;
  name?: string;
  variant?: 'standard' | 'outlined' | 'filled';
  size?: 'small' | 'medium';
}

const FormattedNumberInput: React.FC<FormattedNumberInputProps> = ({
  value,
  label,
  name,
  setValue,
  onChange,
  variant = 'outlined',
  size = 'small',
}) => {
  const [formattedValue, setFormattedValue] = useState('');

  // sync UI when external value changes
  useEffect(() => {
    if (!value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormattedValue('');
      return;
    }

    const raw = String(value).replace(/,/g, '');
    const [intPart, decPart] = raw.split('.');

    const formattedInt = intPart ? Number(intPart).toLocaleString('en-IN') : '';
    const formatted = decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;

    setFormattedValue(formatted);
  }, [value]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value.replace(/,/g, '');

    if (!/^\d*\.?\d*$/.test(input)) return;

    const [intPart, decPart] = input.split('.');

    if (intPart.length > 8) return;
    if (decPart && decPart.length > 2) return;

    setValue?.(input);
    onChange?.(input);

    const formattedInt = intPart ? Number(intPart).toLocaleString('en-IN') : '';
    const formatted = decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;

    setFormattedValue(formatted);
  };

  return (
    <Stack spacing={2} alignItems="center" width="300px">
      <TextField
        label={label}
        name={name}
        variant={variant}
        value={formattedValue}
        onChange={onInputChange}
        size={size}
      />
    </Stack>
  );
};

export default FormattedNumberInput;
