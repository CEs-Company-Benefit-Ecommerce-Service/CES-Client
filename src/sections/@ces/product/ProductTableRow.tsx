import {
  Avatar,
  Checkbox,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
  useTheme,
} from '@mui/material'
// @mui
import { useState } from 'react'
import { Product } from 'src/@types/@ces/product'
import Iconify from 'src/components/Iconify'
import Label from 'src/components/Label'
import { TableMoreMenu } from 'src/components/table'
import { fNumber, fShortenNumber } from 'src/utils/formatNumber'
import { fDateVN } from 'src/utils/formatTime'
// @types

// components

// ------------------------------------------------------d----------------

type Props = {
  row: Product
  selected: boolean
  isValidating?: boolean
  onEditRow: VoidFunction
  onSelectRow: VoidFunction
  onDeleteRow: VoidFunction
}

export default function ProductTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  isValidating,
  onDeleteRow,
}: Props) {
  // const theme = useTheme()

  const { name, price, quantity, category, imageUrl, status, createdAt, updatedAt } = row

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget)
  }
  const theme = useTheme()
  const handleCloseMenu = () => {
    setOpenMenuActions(null)
  }
  if (isValidating) {
    return null
  }
  return (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar alt={name} src={imageUrl} sx={{ mr: 2 }} />
        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>
      <TableCell align="left">{fNumber(price)}</TableCell>
      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {fShortenNumber(quantity)}
      </TableCell>
      <TableCell align="left">{category?.name}</TableCell>
      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={status === 1 ? 'success' : status === 2 ? 'warning' : 'error'}
          sx={{ textTransform: 'capitalize' }}
        >
          {status === 1 ? 'Active' : status === 2 ? 'In Active' : 'Deleted'}
        </Label>
      </TableCell>{' '}
      <TableCell align="left">{fDateVN(createdAt)}</TableCell>
      <TableCell align="left">{fDateVN(updatedAt)}</TableCell>
      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onDeleteRow()
                  handleCloseMenu()
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onEditRow()
                  handleCloseMenu()
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                Edit
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  )
}
