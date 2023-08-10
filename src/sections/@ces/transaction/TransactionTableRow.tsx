import { Avatar, Checkbox, MenuItem, TableCell, TableRow, Typography } from '@mui/material'
// @mui
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { Debt, TransactionHistory } from 'src/@types/@ces'
import { DebtStatus } from 'src/@types/@ces/debt'
import Iconify from 'src/components/Iconify'
import Label from 'src/components/Label'
import { TableMoreMenu } from 'src/components/table'
import { fDateVN } from 'src/utils/formatTime'
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
  const theme = useTheme()

  const { description, companyName, total, type, status, createdAt } = row

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpenMenuActions(null)
  }
  const mapStatus = (status: number) => {
    const rs = Object.values(DebtStatus)
    return rs[status]
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
        {total}
      </TableCell>
      <TableCell align="left">{type === 3 ? 'ZALOPAY' : 'VNPAY'}</TableCell>

      <TableCell align="left">{fDateVN(createdAt)}</TableCell>

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
