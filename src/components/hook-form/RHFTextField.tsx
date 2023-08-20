// form
import { useFormContext, Controller } from 'react-hook-form'
// @mui
import { TextField, TextFieldProps } from '@mui/material'
import { ChangeEvent } from 'react'

// ----------------------------------------------------------------------

type IProps = {
  name: string
  onChange?: any
}

type Props = IProps & TextFieldProps

export default function RHFTextField({ name, onChange: externalOnCHange, ...other }: Props) {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            field.onChange(event)
            externalOnCHange?.(event)
          }}
          fullWidth
          error={!!error}
          helperText={error?.message}
          {...other}
        />
      )}
    />
  )
}
