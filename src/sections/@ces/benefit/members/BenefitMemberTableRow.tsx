import { useState } from 'react'
import { Checkbox, MenuItem, Stack, TableCell, TableRow, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { AccountData } from 'src/@types/@ces/account'
import Avatar from 'src/components/Avatar'
import Iconify from 'src/components/Iconify'
import Label from 'src/components/Label'
import { TableMoreMenu } from 'src/components/table'
import createAvatar from 'src/utils/createAvatar'
import { fDateVN, fTime } from 'src/utils/formatTime'

// ----------------------------------------------------------------------

type Props = {
  row: AccountData
  selected: boolean
  isValidating: boolean
  onEditRow: VoidFunction
  onSelectRow: VoidFunction
  onDeleteRow?: VoidFunction
  onClickRow?: VoidFunction
  onRemoveMemberRow?: VoidFunction
}

export default function BenefitMemberTableRow({
  row,
  selected,
  onEditRow,
  onSelectRow,
  isValidating,
  onDeleteRow,
  onClickRow,
  onRemoveMemberRow,
}: Props) {
  const theme = useTheme()

  const { name, imageUrl, phone, email, status, createdAt, updatedAt, isReceived } = row

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
        <Stack direction={'column'}>
          <Typography variant="inherit" noWrap sx={{ color: 'text.primary' }}>
            {name}
          </Typography>
          <Typography variant="inherit" noWrap sx={{ color: 'text.secondary' }}>
            {email}
          </Typography>
        </Stack>
      </TableCell>

      <TableCell align="left">{phone === 'string' ? '' : phone}</TableCell>
      <TableCell align="center">
        {isReceived && (
          <Iconify
            icon={'eva:checkmark-circle-fill'}
            sx={{
              width: 20,
              height: 20,
              color: 'success.main',
            }}
          />
        )}
        {/* <Iconify
          icon={isReceived ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
          sx={{
            width: 20,
            height: 20,
            color: 'success.main',
            ...(!isReceived && { color: 'warning.main' }),
          }}
        /> */}
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

      <TableCell align="left">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={status === 1 ? 'success' : status === 2 ? 'warning' : 'error'}
          sx={{ textTransform: 'capitalize' }}
        >
          {status === 1 ? 'Active' : status === 2 ? 'In Active' : 'Deleted'}
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
                  onRemoveMemberRow?.()
                  handleCloseMenu()
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Remove
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
