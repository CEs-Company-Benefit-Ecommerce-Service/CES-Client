import { JSX, SetStateAction, useState } from 'react'
// @mui
import {
  DesktopTimePicker,
  Masonry,
  MobileTimePicker,
  StaticTimePicker,
  TimePicker,
} from '@mui/lab'
import {
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  Stack,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
} from '@mui/material'
//
import { Block } from '../../Block'

// ----------------------------------------------------------------------

export default function PickerTime() {
  const [value, setValue] = useState<Date | null>(null)

  return (
    <Masonry columns={{ xs: 1, md: 2 }} spacing={3}>
      <Block title="Basic">
        <TimePicker
          label="12 hours"
          value={value}
          onChange={(newValue: SetStateAction<Date | null>) => {
            setValue(newValue)
          }}
          renderInput={(
            params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps,
                'variant'
              >
          ) => <TextField fullWidth {...params} margin="normal" />}
        />
        <TimePicker
          ampm={false}
          label="24 hours"
          value={value}
          onChange={(newValue: SetStateAction<Date | null>) => {
            setValue(newValue)
          }}
          renderInput={(
            params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps,
                'variant'
              >
          ) => <TextField fullWidth {...params} margin="normal" />}
        />
      </Block>

      <Block title="Responsiveness">
        <MobileTimePicker
          orientation="portrait"
          label="For mobile"
          value={value}
          onChange={(newValue: SetStateAction<Date | null>) => {
            setValue(newValue)
          }}
          renderInput={(
            params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps,
                'variant'
              >
          ) => <TextField {...params} fullWidth margin="normal" />}
        />
        <DesktopTimePicker
          label="For desktop"
          value={value}
          onChange={(newValue: SetStateAction<Date | null>) => {
            setValue(newValue)
          }}
          renderInput={(
            params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps,
                'variant'
              >
          ) => <TextField {...params} margin="normal" fullWidth />}
        />
        <TimePicker
          value={value}
          onChange={setValue}
          renderInput={(
            params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps,
                'variant'
              >
          ) => <TextField {...params} margin="normal" fullWidth />}
        />
      </Block>

      <Block title="Static mode">
        <Stack spacing={3}>
          <StaticTimePicker
            orientation="portrait"
            displayStaticWrapperAs="mobile"
            value={value}
            onChange={(newValue: SetStateAction<Date | null>) => {
              setValue(newValue)
            }}
            renderInput={(
              params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                  OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps,
                  'variant'
                >
            ) => <TextField {...params} />}
          />

          <StaticTimePicker
            ampm
            orientation="landscape"
            openTo="minutes"
            value={value}
            onChange={(newValue: SetStateAction<Date | null>) => {
              setValue(newValue)
            }}
            renderInput={(
              params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                  OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps,
                  'variant'
                >
            ) => <TextField {...params} />}
          />
        </Stack>
      </Block>
    </Masonry>
  )
}
