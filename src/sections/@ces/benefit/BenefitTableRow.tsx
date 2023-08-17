import { useState } from 'react'
// @mui
import { Checkbox, MenuItem, TableCell, TableRow, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { BenefitData } from 'src/@types/@ces'
import Iconify from 'src/components/Iconify'
import Label from 'src/components/Label'
import { TableMoreMenu } from 'src/components/table'
import { fCurrency } from 'src/utils/formatNumber'
import { fDateVN, fTime } from 'src/utils/formatTime'

// ----------------------------------------------------------------------
const PLAN_TYPE = [
  { label: 'Daily', value: 1 },
  { label: 'Weekly', value: 2 },
  { label: 'Monthly', value: 3 },
]

type Props = {
  row: BenefitData
  selected: boolean
  onEditRow: VoidFunction
  onSelectRow: VoidFunction
  onDeleteRow: VoidFunction
  onClickRow?: VoidFunction
}

export default function BenefitTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onClickRow,
}: Props) {
  const theme = useTheme()

  const { name, unitPrice, status, createdAt, updatedAt, groups } = row
  const { endDate, type } = groups[0]

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpenMenuActions(null)
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

      {/* <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src={imageUrl} alt={name} sx={{ mr: 2 }}>
          {createAvatar(name).name}
        </Avatar>

        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell> */}
      <TableCell align="left">{name}</TableCell>
      <TableCell align="left">{fCurrency(unitPrice)}</TableCell>
      <TableCell align="left">{fDateVN(endDate)}</TableCell>

      <TableCell align="left">
        {PLAN_TYPE.find((planType) => planType.value === type)?.label || ''}
      </TableCell>

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
              {/* <MenuItem
                onClick={() => {
                  onDeleteRow()
                  handleCloseMenu()
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem> */}
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
