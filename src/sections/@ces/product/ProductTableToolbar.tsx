// @mui
import {
  Autocomplete,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material'
import Iconify from 'src/components/Iconify'
import { Category } from 'src/@types/@ces'
import { useState } from 'react'
// components

// ----------------------------------------------------------------------

type Props = {
  filterName: string
  onFilterName: (value: string) => void
  optionsSort: {
    id: string
    label?: string
    align?: string
  }[]
  optionsOrderBy: string[]
  cate: Category[]
  filterCate: string
  filterOptions: string
  filterAttribute: string
  onFilterAttribute: (event: React.ChangeEvent<HTMLInputElement>) => void
  onFilterOptions: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleClearFilter: () => void
  handleFilterCate: (value: string | null) => void
}

export default function ProductTableToolbar({
  filterName,
  onFilterName,
  filterOptions,
  onFilterOptions,
  onFilterAttribute,
  optionsOrderBy,
  filterAttribute,
  handleFilterCate,
  filterCate,
  optionsSort,
  handleClearFilter,
  cate,
}: Props) {
  // const debounceFilterName = debounce((event) => {
  //   onFilterName(event)
  // }, 1000)
  const [inputValue, setInputValue] = useState('')
  function cateNameValue(id: string) {
    const selectedOption = cate.find((option) => option.id === id)
    const cateName = selectedOption ? selectedOption.name : null
    return cateName
  }
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2.5, px: 3 }}
      spacing={2}
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
      <Autocomplete
        fullWidth
        value={cateNameValue(filterCate)}
        onChange={(event: any, newValue: string | null) => {
          const selectedOption = cate.find((option) => option.name === newValue)
          const selectedId = selectedOption ? selectedOption.id : null
          handleFilterCate(selectedId)
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue)
        }}
        options={cate?.map((option) => option.name)}
        sx={{
          maxWidth: { sm: 240 },
          textTransform: 'capitalize',
        }}
        renderInput={(params) => <TextField {...params} label={'Category'} />}
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
