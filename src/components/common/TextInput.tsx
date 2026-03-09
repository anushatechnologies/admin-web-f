import React from 'react';
import { TextField, TextFieldProps } from '@mui/material';

/* ----------------------------------------------------------------------
 * Types
 * --------------------------------------------------------------------- */
type DataInput =
  | 'float-number'
  | 'alphabetic'
  | 'alpha-numeric'
  | 'numeric'
  | 'mobile'
  | 'text-area'
  | 'app_id'
  | 'lan_number'
  | 'borrower_name'
  | 'customer_id'
  | 'api';

interface TextInputProps extends Omit<TextFieldProps, 'onChange' | 'onBlur' | 'value'> {
  /** Optional label for the field. */
  label?: string;
  /** Optional error text – shown below the field. */
  errorText?: string;
  /** Controlled value. Omit for uncontrolled usage. */
  value?: string | number;
  /** Name of the field. */
  name?: string;
  /** Called with a *sanitised* ChangeEvent. */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  /** Visual variant – defaults to 'outlined'. */
  variant?: 'outlined' | 'filled' | 'standard';
  /** Determines which sanitisation rule to apply. */
  dataInput?: DataInput;
  defaultValue?: string | number;
  size?: 'small' | 'medium';
}

/* ----------------------------------------------------------------------
 * Helper: tiny “useControlled” implementation (mirrors MUI’s)
 * --------------------------------------------------------------------- */
function useControlled<T>(
  controlled: T | undefined,
  defaultUncontrolled: T,
): [T, (newValue: T) => void] {
  const { current: isControlled } = React.useRef(controlled !== undefined);
  const [valueState, setValueState] = React.useState<T>(defaultUncontrolled);

  // eslint-disable-next-line react-hooks/refs
  const value = isControlled ? (controlled as T) : valueState;

  const setValue = React.useCallback(
    (newValue: T) => {
      if (!isControlled) {
        setValueState(newValue);
      }
    },
    [isControlled],
  );

  return [value, setValue];
}

/* ----------------------------------------------------------------------
 * Main component
 * --------------------------------------------------------------------- */
const TextInput: React.FC<TextInputProps> = ({
  label,
  errorText,
  value: controlledValue,
  name,
  onChange,
  onBlur,
  variant = 'outlined',
  dataInput,
  inputProps,
  defaultValue,
  size = 'small',
  ...rest
}) => {
  /* --------------------------------------------------------------
   * 1️⃣  Determine if we are controlled or uncontrolled.
   * ------------------------------------------------------------ */
  const [value, setUncontrolledValue] = useControlled<string | number>(
    controlledValue,
    defaultValue ?? '',
  );

  /* --------------------------------------------------------------
   * 2️⃣  Sanitisation logic – keep it in a tiny pure function.
   * ------------------------------------------------------------ */
  const sanitise = (raw: string, type?: DataInput): string => {
    switch (type) {
      case 'float-number':
        // Digits + at most one dot.
        return raw.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
      case 'alphabetic':
        return raw.replace(/[^a-zA-Z\s]/g, '');

      case 'alpha-numeric':
        return raw.replace(/[^A-Za-z0-9 ]/g, '');

      case 'numeric':
      case 'mobile':
        return raw.replace(/[^0-9]/g, '');

      case 'text-area':
        return raw.replace(/[^A-Za-z0-9 .-]/g, '');

      case 'app_id':
        return raw.replace(/[^0-9]/g, '');

      case 'lan_number':
      case 'customer_id':
        return raw.replace(/[^A-Za-z0-9 .-]/g, '');

      case 'borrower_name':
        return raw.replace(/[^a-zA-Z\s]/g, '');

      default:
        return raw; // No sanitisation requested.
    }
  };

  /* --------------------------------------------------------------
   * 3️⃣  maxLength per dataInput – kept pure and memoised.
   * ------------------------------------------------------------ */
  const maxLength = React.useMemo(() => {
    switch (dataInput) {
      case 'float-number':
      case 'numeric':
      case 'mobile':
        return 10;
      case 'alphabetic':
      case 'alpha-numeric':
      case 'lan_number':
      case 'borrower_name':
      case 'api':
        return 40;
      case 'text-area':
        return 250;
      case 'app_id':
        return 6;
      case 'customer_id':
        return 20;
      default:
        return undefined;
    }
  }, [dataInput]);

  /* --------------------------------------------------------------
   * 4️⃣  onChange handler – sanitise, update internal state (if
   *     uncontrolled), then forward a synthetic event.
   * ------------------------------------------------------------ */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleaned = sanitise(raw, dataInput);

    // Update our own state when we are uncontrolled.
    setUncontrolledValue(cleaned);

    // Build a synthetic event that mirrors the original one
    // but with the *sanitised* value.
    const synthetic = {
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value: cleaned,
      },
    } as React.ChangeEvent<HTMLInputElement>;

    onChange?.(synthetic);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // If sanitization should also apply on blur:
    const cleaned = sanitise(e.target.value, dataInput);

    // Update uncontrolled internal value
    setUncontrolledValue(cleaned);

    const synthetic = {
      ...e,
      target: {
        ...e.target,
        name: e.target.name,
        value: cleaned,
      },
    } as React.FocusEvent<HTMLInputElement>;

    onBlur?.(synthetic);
  };

  /* --------------------------------------------------------------
   * 5️⃣  Compose final inputProps (maxLength, inputMode, data attr …)
   * ------------------------------------------------------------ */
  const mergedInputProps = {
    maxLength,
    // Show numeric keypad on mobile for numeric‑only fields.
    inputMode:
      dataInput === 'app_id' ||
      dataInput === 'numeric' ||
      dataInput === 'mobile' ||
      dataInput === 'float-number'
        ? 'numeric'
        : undefined,
    ...inputProps,
    'data-input': dataInput,
  };

  return (
    <TextField
      fullWidth
      variant={variant}
      label={label}
      value={value}
      onChange={handleChange}
      onBlur={handleBlur}
      error={Boolean(errorText)}
      helperText={errorText}
      size={size}
      name={name}
      inputProps={mergedInputProps}
      {...rest}
    />
  );
};

export default TextInput;
