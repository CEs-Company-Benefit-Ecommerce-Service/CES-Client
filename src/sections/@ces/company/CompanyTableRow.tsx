import { useState } from 'react'
// @mui
import { Checkbox, MenuItem, TableCell, TableRow, Typography } from '@mui/material'
import { CompanyData } from 'src/@types/@ces'
import Avatar from 'src/components/Avatar'
import Iconify from 'src/components/Iconify'
import { TableMoreMenu } from 'src/components/table'
import createAvatar from 'src/utils/createAvatar'

// ----------------------------------------------------------------------

type Props = {
  row: CompanyData
  selected: boolean
  onEditRow: VoidFunction
  onSelectRow: VoidFunction
  onDeleteRow: VoidFunction
  onDueRow: VoidFunction
  onClickRow?: VoidFunction
}

export default function CompanyTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onDueRow,
  onClickRow,
}: Props) {
  // const theme = useTheme()

  const { name, imageUrl, limits, used, expiredDate } = row

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

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar src={imageUrl} alt={name} sx={{ mr: 2 }}>
          {createAvatar(name).name}
        </Avatar>

        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell align="left">{limits}</TableCell>
      <TableCell align="left">{used}</TableCell>
      <TableCell align="left">{expiredDate}</TableCell>

      {/* <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={status === 1 ? 'success' : status === 2 ? 'warning' : 'error'}
          sx={{ textTransform: 'capitalize' }}
        >
          {status === 1 ? 'Active' : status === 2 ? 'In Active' : 'Deleted'}
        </Label>
      </TableCell> */}

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
              <MenuItem
                onClick={() => {
                  onDueRow()
                  handleCloseMenu()
                }}
              >
                <Iconify icon={'la:file-invoice-dollar'} />
                Dues
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  )
}
