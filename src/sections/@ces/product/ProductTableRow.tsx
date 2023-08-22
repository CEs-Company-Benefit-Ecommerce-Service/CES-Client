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
import { ProductData } from 'src/@types/@ces/product'
import Iconify from 'src/components/Iconify'
import Label from 'src/components/Label'
import { TableMoreMenu } from 'src/components/table'
import { fNumber, fShortenNumber } from 'src/utils/formatNumber'
import { fDateVN, fTime } from 'src/utils/formatTime'
// @types

// components

// ------------------------------------------------------d----------------

type Props = {
  row: ProductData
  selected: boolean
  isValidating?: boolean
  onEditRow: VoidFunction
  onSelectRow: VoidFunction
  onDeleteRow: VoidFunction
  onClickRow?: VoidFunction
}

export default function ProductTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  isValidating,
  onDeleteRow,
  onClickRow,
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
    <TableRow hover selected={selected} sx={{ cursor: 'pointer' }} onClick={onClickRow}>
      <TableCell
        padding="checkbox"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <Checkbox
          checked={selected}
          onClick={(e) => {
            e.stopPropagation()
            onSelectRow()
          }}
        />
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
      </TableCell>
      <TableCell align="left">
        <Typography variant="inherit" noWrap sx={{ color: 'text.primary' }}>
          {fDateVN(createdAt)}
        </Typography>
        <Typography variant="inherit" noWrap sx={{ color: 'text.secondary' }}>
          {fTime(createdAt)}
        </Typography>
      </TableCell>

      <TableCell align="left">
        <Typography variant="inherit" noWrap sx={{ color: 'text.primary' }}>
          {fDateVN(updatedAt)}
        </Typography>
        <Typography variant="inherit" noWrap sx={{ color: 'text.secondary' }}>
          {fTime(updatedAt)}
        </Typography>
      </TableCell>
      <TableCell
        align="right"
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
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
