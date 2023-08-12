import { Checkbox, MenuItem, TableCell, TableRow, Typography, useTheme } from '@mui/material'
import { useState } from 'react'
import { TransactionHistory } from 'src/@types/@ces'
import Iconify from 'src/components/Iconify'
import Label from 'src/components/Label'
import { TableMoreMenu } from 'src/components/table'
import { fNumber } from 'src/utils/formatNumber'
import { fDateVN, fTime } from 'src/utils/formatTime'

type Props = {
  row: TransactionHistory
  selected: boolean
  onViewRow: VoidFunction
  onSelectRow: VoidFunction
  onDeleteRow: VoidFunction
  isValidating?: boolean
}

export default function CompanyTransactionTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  isValidating,
}: Props) {
  const theme = useTheme()

  const { invoiceId, total, type, status, createdAt, id, description } = row

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

      <TableCell align="left">{invoiceId ? `INV-${invoiceId}` : id} </TableCell>

      <TableCell align="left">
        <Typography variant="inherit" noWrap sx={{ color: 'text.primary' }}>
          {fDateVN(createdAt)}
        </Typography>
        <Typography variant="inherit" noWrap sx={{ color: 'text.secondary' }}>
          {fTime(createdAt)}
        </Typography>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {fNumber(total)}
      </TableCell>

      {(type === 3 || type == 5 || type == 6) && (
        <TableCell align="left">
          {type === 3
            ? 'ZALOPAY'
            : type === 5
            ? 'VNPAY'
            : type == 6
            ? 'Banking'
            : 'Transfer Benefit'}
        </TableCell>
      )}

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {status ? (
          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
            color={
              (status === 0 && 'warning') || (status === 1 && 'primary') || 'default'
              // (mapStatus(status) === 'shipping' && 'info') ||
              // (mapStatus(status) === 'complete' && 'success') ||
              // (mapStatus(status) === 'cancel' && 'error') ||
            }
            sx={{ textTransform: 'capitalize' }}
          >
            {/* Sydney Sweeney, tv series skins */}
            {(status === 0 && 'pending') || (status === 1 && 'paid') || status}
          </Label>
        ) : (
          description
        )}
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
