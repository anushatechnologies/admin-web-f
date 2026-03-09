import React from 'react';
import { Autocomplete, TextField, Checkbox, FormHelperText, FormControl } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectAutoSearchProps {
  label?: string;
  value: string[];
  name: string;
  options: Option[];
  onChange?: (selected: string[]) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  errorText?: string;
  fullWidth?: boolean;
  size?: 'small' | 'medium';
  showSelectAll?: boolean;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const SELECT_ALL_VALUE = '__select_all__';

const MultiSelectAutoSearch: React.FC<MultiSelectAutoSearchProps> = ({
  label,
  value,
  options,
  name,
  onChange,
  onBlur,
  errorText,
  fullWidth = true,
  size = 'small',
  showSelectAll = false,
}) => {
  const allSelected = value.length === options.length && options.length > 0;

  const computedOptions: Option[] = showSelectAll
    ? [{ value: SELECT_ALL_VALUE, label: 'Select All' }, ...options]
    : options;

  const selectedOptions = options.filter((opt) => value.includes(opt.value));

  const handleChange = (_: any, selected: Option[]) => {
    if (!onChange) return;

    const values = selected.map((s) => s.value);

    if (values.includes(SELECT_ALL_VALUE)) {
      onChange(allSelected ? [] : options.map((o) => o.value));
    } else {
      onChange(values);
    }
  };

  return (
    <FormControl fullWidth={fullWidth} error={!!errorText}>
      <Autocomplete
        multiple
        disableCloseOnSelect
        options={computedOptions}
        value={selectedOptions}
        onChange={handleChange}
        isOptionEqualToValue={(o, v) => o.value === v.value}
        getOptionLabel={(option) => option.label}
        fullWidth
        /* ✅ COMMA SEPARATED TEXT */
        renderTags={(selected) => selected.map((opt) => opt.label).join(', ')}
        /* ✅ HORIZONTAL SCROLL */
        sx={{
          /* Keep field fixed */
          '& .MuiAutocomplete-inputRoot': {
            flexWrap: 'nowrap',
            overflow: 'hidden', // ❌ no scroll here
            alignItems: 'center',
          },

          /* Scroll ONLY the text */
          '& .MuiAutocomplete-input': {
            minWidth: 0,
            flexGrow: 1,
            whiteSpace: 'nowrap',
            overflowX: 'auto', // ✅ text scroll
            overflowY: 'hidden',
            paddingRight: '32px', // space for icons
          },

          /* Keep icons fixed */
          '& .MuiAutocomplete-endAdornment': {
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            background: '#fff',
          },

          /* Optional: slim scrollbar */
          '& .MuiAutocomplete-input::-webkit-scrollbar': {
            height: 6,
          },
        }}
        renderOption={(props, option, { selected }) => (
          <li {...props} key={option.value}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              checked={option.value === SELECT_ALL_VALUE ? allSelected : selected}
              indeterminate={option.value === SELECT_ALL_VALUE && value.length > 0 && !allSelected}
              sx={{ mr: 1 }}
            />
            {option.label}
          </li>
        )}
        renderInput={(params) => {
          const selectedText = selectedOptions.map((opt) => opt.label).join(', ');

          return (
            <TextField
              {...params}
              label={label}
              size={size}
              name={name}
              error={!!errorText}
              onBlur={(e) =>
                onBlur?.({
                  ...e,
                  target: {
                    ...e.target,
                    name,
                  },
                })
              }
              InputProps={{
                ...params.InputProps,

                /* 🔑 Hide actual input typing text */
                sx: {
                  '& input': {
                    opacity: 0,
                    pointerEvents: 'none',
                  },
                },

                /* ✅ SCROLLABLE TEXT CONTAINER */
                startAdornment: (
                  <div
                    style={{
                      maxWidth: '100%',
                      overflowX: 'auto',
                      whiteSpace: 'nowrap',
                      textOverflow: 'clip',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {selectedText || '\u00A0'}
                  </div>
                ),
              }}
            />
          );
        }}
      />

      {errorText && <FormHelperText>{errorText}</FormHelperText>}
    </FormControl>
  );
};

export default MultiSelectAutoSearch;
