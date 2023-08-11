import { DatePicker } from '@mui/lab'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import {
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
} from '@mui/material'
import { SetStateAction, JSX, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
type IProps = {
  name: string
  label: string
}

type Props = IProps

export default function RHFDatePicker({ name, label }: Props) {
  const [originalReleaseDate, setOriginalReleaseDate] = useState(null)
  const { control } = useFormContext()
  return (
    <Controller
      name={name}
      defaultValue={originalReleaseDate}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={label}
            value={originalReleaseDate}
            onChange={(newValue: SetStateAction<null>) => {
              setOriginalReleaseDate(newValue)
            }}
            renderInput={(
              params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                  FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps,
                  'variant'
                >
            ) => (
              <TextField
                {...field}
                fullWidth
                error={!!error}
                helperText={error?.message}
                {...params}
              />
            )}
          />
        </LocalizationProvider>
      )}
    />
  )
}
