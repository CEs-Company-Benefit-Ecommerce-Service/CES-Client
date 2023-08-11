import isWeekend from 'date-fns/isWeekend'
import { JSX, SetStateAction, useState } from 'react'
// @mui
import {
  DatePicker,
  DesktopDatePicker,
  Masonry,
  MobileDatePicker,
  StaticDatePicker,
} from '@mui/lab'
import {
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
} from '@mui/material'
//
import { Block } from '../../Block'

// ----------------------------------------------------------------------

export default function PickerDate() {
  const [value, setValue] = useState<Date | null>(new Date())

  return (
    <Masonry columns={{ xs: 1, md: 2 }} spacing={3}>
      <Block title="Basic">
        <DesktopDatePicker
          label="For desktop"
          value={value}
          minDate={new Date('2017-01-01')}
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

        <MobileDatePicker
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
          ) => <TextField fullWidth {...params} margin="normal" />}
        />
      </Block>

      <Block title="Static mode">
        <StaticDatePicker<Date>
          orientation="landscape"
          openTo="day"
          value={value}
          shouldDisableDate={isWeekend}
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
      </Block>

      <Block title="Views playground">
        <DatePicker
          views={['year']}
          label="Year only"
          value={value}
          onChange={(newValue: SetStateAction<Date | null>) => {
            setValue(newValue)
          }}
          renderInput={(
            params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps,
                'variant'
              >
          ) => <TextField {...params} fullWidth margin="normal" helperText={null} />}
        />
        <DatePicker
          views={['year', 'month']}
          label="Year and Month"
          minDate={new Date('2012-03-01')}
          maxDate={new Date('2023-06-01')}
          value={value}
          onChange={(newValue: SetStateAction<Date | null>) => {
            setValue(newValue)
          }}
          renderInput={(
            params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps,
                'variant'
              >
          ) => <TextField {...params} fullWidth margin="normal" helperText={null} />}
        />
        <DatePicker
          openTo="year"
          views={['year', 'month', 'day']}
          label="Year, month and date"
          value={value}
          onChange={(newValue: SetStateAction<Date | null>) => {
            setValue(newValue)
          }}
          renderInput={(
            params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps,
                'variant'
              >
          ) => <TextField {...params} fullWidth margin="normal" helperText={null} />}
        />
        <DatePicker
          views={['day', 'month', 'year']}
          label="Invert the order of views"
          value={value}
          onChange={(newValue: SetStateAction<Date | null>) => {
            setValue(newValue)
          }}
          renderInput={(
            params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps,
                'variant'
              >
          ) => <TextField {...params} fullWidth margin="normal" helperText={null} />}
        />
        <DatePicker
          views={['day']}
          label="Just date"
          value={value}
          onChange={(newValue: SetStateAction<Date | null>) => {
            setValue(newValue)
          }}
          renderInput={(
            params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                OutlinedTextFieldProps | FilledTextFieldProps | StandardTextFieldProps,
                'variant'
              >
          ) => <TextField {...params} fullWidth margin="normal" helperText={null} />}
        />
      </Block>
    </Masonry>
  )
}
