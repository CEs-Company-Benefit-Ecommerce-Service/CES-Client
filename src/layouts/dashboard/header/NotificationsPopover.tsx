import { useState } from 'react'
// @mui
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  ListSubheader,
  Tooltip,
  Typography,
} from '@mui/material'
// utils
import { fToNow } from '../../../utils/formatTime'
// _mock_
// components
import { NotificationData } from 'src/@types/@ces'
import Iconify from '../../../components/Iconify'
import MenuPopover from '../../../components/MenuPopover'
import Scrollbar from '../../../components/Scrollbar'
import { IconButtonAnimate } from '../../../components/animate'
import { notificationApi } from 'src/api-client'

// ----------------------------------------------------------------------

export default function NotificationsPopover({
  totalUnRead,
  dataUnRead,
  dataRead,
}: {
  totalUnRead: number
  dataUnRead?: NotificationData[]
  dataRead?: NotificationData[]
}) {
  const [open, setOpen] = useState<HTMLElement | null>(null)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget)
  }
  const handleClose = () => {
    setOpen(null)
  }

  const handleMarkAllAsRead = () => {
    notificationApi.readAll()
  }

  return (
    <>
      <IconButtonAnimate
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" width={20} height={20} />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 360, p: 0, mt: 1.5, ml: 0.75 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            {totalUnRead > 0 && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                You have {totalUnRead} unread messages
              </Typography>
            )}
          </Box>

          {totalUnRead > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={handleMarkAllAsRead}>
                <Iconify icon="eva:done-all-fill" width={20} height={20} />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Scrollbar sx={{ height: { xs: 340, sm: 'auto' } }}>
          {dataUnRead && dataUnRead.length > 0 && (
            <List
              disablePadding
              subheader={
                <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                  New
                </ListSubheader>
              }
            >
              {dataUnRead?.map((item) => (
                <NotificationItem key={item.id} notification={item} />
              ))}
            </List>
          )}

          {dataRead && dataRead.length > 0 && (
            <List
              disablePadding
              subheader={
                <ListSubheader disableSticky sx={{ py: 1, px: 2.5, typography: 'overline' }}>
                  Is read
                </ListSubheader>
              }
            >
              {dataRead?.map((item) => (
                <NotificationItem key={item.id} notification={item} />
              ))}
            </List>
          )}
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }}>
          <Button fullWidth disableRipple>
            View All
          </Button>
        </Box>
      </MenuPopover>
    </>
  )
}

// ----------------------------------------------------------------------

function NotificationItem({ notification }: { notification: NotificationData }) {
  const { avatar, title } = renderContent(notification)

  return (
    <ListItemButton
      sx={{
        py: 1.5,
        px: 2.5,
        mt: '1px',
        ...(!notification.isRead && {
          bgcolor: 'action.selected',
        }),
      }}
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: 'background.neutral' }}>{avatar}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={title}
        secondary={
          <Typography
            variant="caption"
            sx={{
              mt: 0.5,
              display: 'flex',
              alignItems: 'center',
              color: 'text.disabled',
            }}
          >
            <Iconify icon="eva:clock-outline" sx={{ mr: 0.5, width: 16, height: 16 }} />
            {fToNow(notification.createdAt)}
          </Typography>
        }
      />
    </ListItemButton>
  )
}

// ----------------------------------------------------------------------

function renderContent(notification: NotificationData) {
  const title = (
    // <Typography variant="subtitle2">
    //   {notification.title}
    //   <Typography component="span" variant="body2" sx={{ color: 'text.secondary' }}>
    //     &nbsp; {notification.description}
    //   </Typography>
    // </Typography>
    <Typography variant="subtitle2">{notification.description}</Typography>
  )

  if (notification.order) {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api-dev.vercel.app/assets/icons/ic_notification_package.svg"
        />
      ),
      title,
    }
  }
  // if (notification.type === 'order_shipped') {
  //   return {
  //     avatar: (
  //       <img
  //         alt={notification.title}
  //         src="https://minimal-assets-api-dev.vercel.app/assets/icons/ic_notification_shipping.svg"
  //       />
  //     ),
  //     title,
  //   }
  // }
  // if (notification.type === 'mail') {
  //   return {
  //     avatar: (
  //       <img
  //         alt={notification.title}
  //         src="https://minimal-assets-api-dev.vercel.app/assets/icons/ic_notification_mail.svg"
  //       />
  //     ),
  //     title,
  //   }
  // }
  if (notification.transaction) {
    return {
      avatar: (
        <img
          alt={notification.title}
          src="https://minimal-assets-api-dev.vercel.app/assets/icons/ic_notification_chat.svg"
        />
      ),
      title,
    }
  }
  return {
    // avatar: notification. ? <img alt={notification.title} src={notification.avatar} /> : null,
    title,
  }
}
