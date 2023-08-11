// @mui
import DatePicker from '@mui/lab/DatePicker'
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  FilledTextFieldProps,
  OutlinedTextFieldProps,
  Stack,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
} from '@mui/material'
import { JSX } from 'react'

// ----------------------------------------------------------------------

type Props = {
  open: boolean
  startTime: Date | null
  endTime: Date | null
  onClose: VoidFunction
  onChangeStartTime: (newValue: Date | null) => void
  onChangeEndTime: (newValue: Date | null) => void
}

export default function KanbanDatePickerDialog({
  startTime,
  endTime,
  onChangeStartTime,
  onChangeEndTime,
  open,
  onClose,
}: Props) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle> Choose due date </DialogTitle>

      <Stack spacing={2} sx={{ px: 3, mt: 3 }}>
        <DatePicker
          label="Start date"
          value={startTime}
          onChange={onChangeStartTime}
          renderInput={(
            params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps,
                'variant'
              >
          ) => <TextField {...params} />}
        />

        <DatePicker
          label="End date"
          value={endTime}
          onChange={onChangeEndTime}
          renderInput={(
            params: JSX.IntrinsicAttributes & { variant?: TextFieldVariants | undefined } & Omit<
                FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps,
                'variant'
              >
          ) => <TextField {...params} />}
        />
      </Stack>

      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  )
}
