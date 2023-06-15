import { InputAdornment, Stack, TextField } from '@mui/material'
import Iconify from 'src/components/Iconify'
// components

// ----------------------------------------------------------------------

type Props = {
  optionsRole?: {
    code: number | string
    label: string
  }[]
  filterName: string
  filterRole: string
  onFilterName: (value: string) => void
  onFilterRole: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export default function ProjectTableToolbar({
  filterName,
  filterRole,
  onFilterName,
  onFilterRole,
  optionsRole,
}: Props) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      {/* <TextField
        fullWidth
        select
        label="Role"
        value={filterRole}
        onChange={onFilterRole}
        SelectProps={{
          MenuProps: {
            sx: { '& .MuiPaper-root': { maxHeight: 260 } },
          },
        }}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
      >
        {optionsRole?.map((option) => (
          <MenuItem
            key={option.code}
            value={option.code}
            sx={{
              mx: 1,
              my: 0.5,
              borderRadius: 0.75,
              typography: 'body2',
              textTransform: 'capitalize',
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </TextField> */}

      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Search project..."
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Iconify
                icon={'eva:search-fill'}
                sx={{ color: 'text.disabled', width: 20, height: 20 }}
              />
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  )
}
