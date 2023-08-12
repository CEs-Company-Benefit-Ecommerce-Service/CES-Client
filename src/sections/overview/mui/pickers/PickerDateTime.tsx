// @mui
import { DateTimePicker, DesktopDateTimePicker, MobileDateTimePicker } from '@mui/lab'
import {
  FilledTextFieldProps,
  OutlinedTextFieldProps, Stack, StandardTextFieldProps, TextField, TextFieldVariants
} from '@mui/material'
import { JSX, SetStateAction, useState } from 'react'
import { Block } from '../../Block'

// ----------------------------------------------------------------------

export default function PickerDateTime() {
  const [value, setValue] = useState<Date | null>(new Date())
  const [valueResponsive, setValueResponsive] = useState<Date | null>(
    new Date('2018-01-01T00:00:00.000Z')
  )

  return (
    <Stack spacing={3} direction={{ xs: 'column', md: 'row' }}>
      <Block title="Basic">
        <DateTimePicker
          renderInput={(
            props: JSX.IntrinsicAttributes & {
              variant?: TextFieldVariants | undefined // @mui
            } & Omit<
                FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps,
                'variant'
              >
          ) => <TextField {...props} fullWidth />}
          label="DateTimePicker"
          value={value}
          onChange={setValue}
        />
      </Block>

      <Block title="Responsiveness">
        <MobileDateTimePicker
          value={valueResponsive}
          onChange={(newValue: SetStateAction<Date | null>) => {
            setValueResponsive(newValue)
          }}
          renderInput={(
            params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps,
                'variant'
              >
          ) => <TextField {...params} fullWidth margin="normal" />}
        />
        <DesktopDateTimePicker
          value={valueResponsive}
          onChange={(newValue: SetStateAction<Date | null>) => {
            setValueResponsive(newValue)
          }}
          renderInput={(
            params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps,
                'variant'
              >
          ) => <TextField {...params} margin="normal" fullWidth />}
        />
        <DateTimePicker
          value={valueResponsive}
          onChange={(newValue: SetStateAction<Date | null>) => {
            setValueResponsive(newValue)
          }}
          renderInput={(
            params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps,
                'variant'
              >
          ) => <TextField {...params} margin="normal" fullWidth />}
        />
      </Block>
    </Stack>
  )
}
