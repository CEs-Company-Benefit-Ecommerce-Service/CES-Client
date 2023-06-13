import { useState } from 'react'
// @mui
import { Checkbox, MenuItem, TableCell, TableRow, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { ProjectData } from 'src/@types/@ces/project'
import Iconify from 'src/components/Iconify'
import Label from 'src/components/Label'
import { TableMoreMenu } from 'src/components/table'
import Avatar from 'src/components/Avatar'
import createAvatar from 'src/utils/createAvatar'
// @types
// import { UserManager } from '../../../../@types/user';
// // components
// import Label from '../../../../components/Label';
// import Iconify from '../../../../components/Iconify';
// import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

type Props = {
  row: ProjectData
  selected: boolean
  onEditRow: VoidFunction
  onSelectRow: VoidFunction
  onDeleteRow: VoidFunction
  onClickRow?: VoidFunction
}

export default function ProjectTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  onDeleteRow,
  onClickRow,
}: Props) {
  const theme = useTheme()

  const { name, imageUrl, status, companyId } = row

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

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={(status === 0 && 'error') || 'success'}
          sx={{ textTransform: 'capitalize' }}
        >
          {status === 1 ? 'Active' : 'Deactive'}
        </Label>
      </TableCell>

      <TableCell align="left">{companyId}</TableCell>

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
