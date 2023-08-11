// form
import { Controller, useFormContext } from 'react-hook-form'
// @mui
import DatePicker from '@mui/lab/DatePicker'
import {
  FilledTextFieldProps,
  MenuItem,
  OutlinedTextFieldProps,
  Stack,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
} from '@mui/material'
// components
import { JSX } from 'react'
import { RHFSelect, RHFTextField } from '../../../../components/hook-form'

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['paid', 'unpaid', 'overdue', 'draft']

// ----------------------------------------------------------------------

export default function InvoiceNewEditStatusDate() {
  const { control, watch } = useFormContext()

  const values = watch()

  return (
    <Stack
      spacing={2}
      direction={{ xs: 'column', sm: 'row' }}
      sx={{ p: 3, bgcolor: 'background.neutral' }}
    >
      <RHFTextField
        disabled
        name="invoiceNumber"
        label="Invoice number"
        value={`INV-${values.invoiceNumber}`}
      />

      <RHFSelect
        fullWidth
        name="status"
        label="Status"
        InputLabelProps={{ shrink: true }}
        SelectProps={{ native: false, sx: { textTransform: 'capitalize' } }}
      >
        {STATUS_OPTIONS.map((option) => (
          <MenuItem
            key={option}
            value={option}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option}
          </MenuItem>
        ))}
      </RHFSelect>

      <Controller
        name="createDate"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            label="Date create"
            value={field.value}
            onChange={(newValue: any) => {
              field.onChange(newValue)
            }}
            renderInput={(
              params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                  OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps,
                  'variant'
                >
            ) => <TextField {...params} fullWidth error={!!error} helperText={error?.message} />}
          />
        )}
      />

      <Controller
        name="dueDate"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <DatePicker
            label="Due date"
            value={field.value}
            onChange={(newValue: any) => {
              field.onChange(newValue)
            }}
            renderInput={(
              params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                  OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps,
                  'variant'
                >
            ) => <TextField {...params} fullWidth error={!!error} helperText={error?.message} />}
          />
        )}
      />
    </Stack>
  )
}
