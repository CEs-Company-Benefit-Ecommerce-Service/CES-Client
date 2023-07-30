import { Checkbox, MenuItem, TableCell, TableRow } from '@mui/material'
// @mui
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { Order, Status } from 'src/@types/@ces/order'
import Iconify from 'src/components/Iconify'
import Label from 'src/components/Label'
import { TableMoreMenu } from 'src/components/table'
import { fNumber } from 'src/utils/formatNumber'
import { fDateVN } from 'src/utils/formatTime'
type Props = {
  row: Order
  selected: boolean
  onSelectRow: VoidFunction
  onViewRow: VoidFunction
  isValidating?: boolean
  onClickRow?: VoidFunction
}

export default function OrderTableRow({
  row,
  isValidating,
  selected,
  onSelectRow,
  onViewRow,
  onClickRow,
}: Props) {
  const theme = useTheme()

  const { total, orderCode, companyName, createdAt, updatedAt, status } = row

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpenMenuActions(null)
  }

  const mapStatus = (status: number) => {
    const rs = Object.values(Status)
    return rs[status]
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

      <TableCell align="left">{orderCode}</TableCell>
      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {fNumber(total)}
      </TableCell>
      <TableCell align="left">{companyName}</TableCell>
      <TableCell align="left">{fDateVN(createdAt)}</TableCell>
      <TableCell align="left">{fDateVN(updatedAt)}</TableCell>
      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (mapStatus(status) === 'new' && 'primary') ||
            (mapStatus(status) === 'ready' && 'warning') ||
            (mapStatus(status) === 'shipping' && 'info') ||
            (mapStatus(status) === 'complete' && 'success') ||
            (mapStatus(status) === 'cancel' && 'error') ||
            'default'
          }
          sx={{ textTransform: 'capitalize' }}
        >
          {mapStatus(status)}
        </Label>
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
