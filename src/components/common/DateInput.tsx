// UniversalDatePicker.tsx
import React from 'react';
import { Stack, useTheme, useMediaQuery } from '@mui/material';
import {
  LocalizationProvider,
  DesktopDatePicker,
  MobileDatePicker,
  //   DesktopDateTimePicker,
  //   MobileDateTimePicker,
  DesktopTimePicker,
  MobileTimePicker,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface UniversalDatePickerProps {
  label?: string;
  type?: 'date' | 'datetime' | 'time' | 'range';
  value?: any;
  onChange?: (v: any) => void;
  name?: string;
  // For range only
  startLabel?: string;
  endLabel?: string;
}

export default function DateInput({
  label,
  type = 'date',
  value,
  onChange,
  name,
  startLabel = 'Start Date',
  endLabel = 'End Date',
}: UniversalDatePickerProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const DateComp = isMobile ? MobileDatePicker : DesktopDatePicker;
  //   const DateTimeComp = isMobile ? MobileDateTimePicker : DesktopDateTimePicker;
  const TimeComp = isMobile ? MobileTimePicker : DesktopTimePicker;

  const dateChangeHandler = (newVal: any) => {
    const synthetic = {
      target: {
        name: name,
        value: newVal.$d,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange?.(synthetic);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {type === 'range' ? (
        <Stack direction="row" spacing={2}>
          <DateComp
            label={startLabel}
            value={value?.start || null}
            onChange={(newVal) => onChange?.({ ...value, start: newVal })}
            slotProps={{ textField: { fullWidth: true, size: 'small' } }}
          />

          <DateComp
            label={endLabel}
            value={value?.end || null}
            onChange={(newVal) => onChange?.({ ...value, end: newVal })}
            slotProps={{ textField: { fullWidth: true, size: 'small' } }}
          />
        </Stack>
      ) : type === 'datetime' ? (
        <TimeComp
          label={label}
          value={value}
          onChange={onChange}
          name={name}
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true,
            },
          }}
        />
      ) : (
        <DateComp
          label={label}
          value={value}
          onChange={(newVal: any) => dateChangeHandler(newVal)}
          name={name}
          slotProps={{
            textField: {
              size: 'small',
              fullWidth: true,
            },
          }}
        />
      )}
    </LocalizationProvider>
  );
}
