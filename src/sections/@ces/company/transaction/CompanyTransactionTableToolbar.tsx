import { IconButton, InputAdornment, MenuItem, Stack, TextField, Tooltip } from '@mui/material'
import Iconify from 'src/components/Iconify'
type Props = {
  optionsStatus?: string[]
  filterName: string
  filterStatus?: string
  onFilterName: (value: string) => void
  onFilterStatus?: (event: React.ChangeEvent<HTMLInputElement>) => void
  optionsSort: {
    id: string
    label?: string
    align?: string
  }[]
  optionsOrderBy: string[]
  filterOptions: string
  filterAttribute: string
  onFilterAttribute: (event: React.ChangeEvent<HTMLInputElement>) => void
  onFilterOptions: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleClearFilter: () => void
}

export default function CompanyTransactionTableToolbar({
  filterName,
  filterStatus,
  onFilterName,
  onFilterStatus,
  optionsStatus,
  filterOptions,
  onFilterOptions,
  onFilterAttribute,
  optionsOrderBy,
  filterAttribute,
  optionsSort,
  handleClearFilter,
}: Props) {
  return (
    <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }} sx={{ py: 2.5, px: 3 }}>
      {/* <TextField
        fullWidth
        select
        label="Status"
        value={filterStatus}
        onChange={onFilterStatus}
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
        {optionsStatus.map((option) => (
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
      </TextField> */}

      <TextField
        fullWidth
        value={filterName}
        onChange={(event) => onFilterName(event.target.value)}
        placeholder="Search ..."
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
      <TextField
        fullWidth
        select
        label="Sort By"
        value={filterAttribute}
        onChange={onFilterAttribute}
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
        {optionsSort?.map((option) => (
          <MenuItem
            key={option.id}
            value={option.id}
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
      </TextField>
      <TextField
        fullWidth
        select
        label="Order By"
        value={filterOptions}
        onChange={onFilterOptions}
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
        {optionsOrderBy?.map((option) => (
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
      </TextField>
      <Tooltip title="Filter list">
        <IconButton onClick={handleClearFilter}>
          <Iconify icon={'fluent-mdl2:clear-filter'} />
        </IconButton>
      </Tooltip>
    </Stack>
  )
}
