import { Checkbox, MenuItem, Stack, TableCell, TableRow, Typography } from '@mui/material'
// @mui
import { useTheme } from '@mui/material/styles'
import { useState } from 'react'
import { Order, Status } from 'src/@types/@ces/order'
import Iconify from 'src/components/Iconify'
import Label from 'src/components/Label'
import { TableMoreMenu } from 'src/components/table'
import { fNumber } from 'src/utils/formatNumber'
import { fDateVN, fTime } from 'src/utils/formatTime'
type Props = {
  row: Order
  selected: boolean
  onSelectRow: VoidFunction
  onViewRow: VoidFunction

  onClickRow?: VoidFunction
}

export default function CompanyOrderTableRow({
  row,
  selected,
  onSelectRow,
  onViewRow,
  onClickRow,
}: Props) {
  const theme = useTheme()

  const { total, orderCode, createdAt, status, employee } = row

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

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <Avatar src={employee.account.imageUrl} alt={employee.account.name} sx={{ mr: 2 }}>
          {createAvatar(employee.account.name).name}
        </Avatar> */}
        <Stack direction={'column'}>
          <Typography variant="inherit" noWrap sx={{ color: 'text.primary' }}>
            {employee.account.name}
          </Typography>
          <Typography variant="inherit" noWrap sx={{ color: 'text.secondary' }}>
            {employee.account.email}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {fNumber(total)}
      </TableCell>

      <TableCell align="left">
        <Typography variant="inherit" noWrap sx={{ color: 'text.primary' }}>
          {fDateVN(createdAt)}
        </Typography>
        <Typography variant="inherit" noWrap sx={{ color: 'text.secondary' }}>
          {fTime(createdAt)}
        </Typography>
      </TableCell>
      {/* <TableCell align="left">
        <Typography variant="inherit" noWrap sx={{ color: 'text.primary' }}>
          {fDateVN(updatedAt)}
        </Typography>
        <Typography variant="inherit" noWrap sx={{ color: 'text.secondary' }}>
          {fTime(updatedAt)}
        </Typography>
      </TableCell> */}

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
