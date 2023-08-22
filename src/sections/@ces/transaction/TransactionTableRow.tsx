import { Checkbox, MenuItem, TableCell, TableRow, Typography } from '@mui/material'
import { useState } from 'react'
import { TransactionHistory } from 'src/@types/@ces'
import Iconify from 'src/components/Iconify'
import { TableMoreMenu } from 'src/components/table'
import { fCurrency } from 'src/utils/formatNumber'
import { fDateVN, fTime } from 'src/utils/formatTime'
// @types

// components

// ------------------------------------------------------d----------------

type Props = {
  row: TransactionHistory
  selected: boolean
  onViewRow: VoidFunction
  onSelectRow: VoidFunction
  onDeleteRow: VoidFunction
  isValidating?: boolean
}

export default function TransactionTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  isValidating,
}: Props) {
  const { description, total, type, createdAt } = row

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget)
  }

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

      <TableCell align="left">{description}</TableCell>
      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {fCurrency(total)}
      </TableCell>

      <TableCell align="left">
        {type === 3 ? 'ZALOPAY' : type === 5 ? 'VNPAY' : type == 6 ? 'Banking' : 'Transfer Benefit'}
      </TableCell>

      {/* <TableCell align="left">{type === 3 ? 'ZALOPAY' : 'VNPAY'}</TableCell> */}

      <TableCell align="left">
        <Typography variant="inherit" noWrap sx={{ color: 'text.primary' }}>
          {fDateVN(createdAt)}
        </Typography>
        <Typography variant="inherit" noWrap sx={{ color: 'text.secondary' }}>
          {fTime(createdAt)}
        </Typography>
      </TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onViewRow()
                  handleCloseMenu()
                }}
              >
                <Iconify icon={'eva:eye-fill'} />
                View
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  )
}
