// @mui
import { IconButton, InputAdornment, Stack, TextField, Tooltip } from '@mui/material'
import Iconify from 'src/components/Iconify'
import { debounce } from 'lodash'
// components

// ----------------------------------------------------------------------

type Props = {
  filterName?: string
  onFilterName: (value: string) => void
}

export default function ProductTableToolbar({ filterName, onFilterName }: Props) {
  // const debounceFilterName = debounce((event) => {
  //   onFilterName(event)
  // }, 1000)
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2.5, px: 3 }}
    >
      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Search product..."
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

      <Tooltip title="Filter list">
        <IconButton>
          <Iconify icon={'ic:round-filter-list'} />
        </IconButton>
      </Tooltip>
    </Stack>
  )
}
