import { Checkbox, MenuItem, TableCell, TableRow, Typography } from '@mui/material'
// @mui
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { TransactionHistory } from 'src/@types/@ces'
import Iconify from 'src/components/Iconify'
import Label from 'src/components/Label'
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
  onClickRow?: VoidFunction
}

export default function DebtTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onClickRow,
  onDeleteRow,
  isValidating,
}: Props) {
  const theme = useTheme()

  const { companyName, total, type, status, createdAt } = row

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
    <TableRow hover selected={selected} onClick={onClickRow}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell align="left">{companyName}</TableCell>
      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {fCurrency(total)}
      </TableCell>
      <TableCell align="left">
        {type === 3 ? 'ZALOPAY' : type === 5 ? 'VNPAY' : type == 6 ? 'Banking' : 'Transfer Benefit'}
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
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            status === 1 ? 'success' : status === 3 ? 'info' : status === 0 ? 'warning' : 'error'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {status === 1 ? 'Success' : status === 2 ? 'Reject' : status === 0 ? 'New' : 'Processing'}
        </Label>
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
