import { useState } from 'react'
// @mui
import {
  Avatar,
  Badge,
  Box,
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
import { useRouter } from 'next/router'
import { NotificationData } from 'src/@types/@ces'
import { notificationApi } from 'src/api-client'
import { PATH_CES } from 'src/routes/paths'
import Iconify from '../../../components/Iconify'
import MenuPopover from '../../../components/MenuPopover'
import Scrollbar from '../../../components/Scrollbar'
import { IconButtonAnimate } from '../../../components/animate'

// ----------------------------------------------------------------------

export default function NotificationsPopover({
  totalUnRead,
  dataUnRead,
  dataRead,
  mutateUnRead,
  mutateRead,
}: {
  totalUnRead: number
  dataUnRead?: NotificationData[]
  dataRead?: NotificationData[]
  mutateUnRead?: any
  mutateRead?: any
}) {
  const { push } = useRouter()
  const [open, setOpen] = useState<HTMLElement | null>(null)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget)
  }
  const handleClose = () => {
    setOpen(null)
  }

  const handleMarkAllAsRead = async () => {
    await notificationApi.readAll()
    mutateRead()
    mutateUnRead()
    setOpen(null)
  }

  const handleClickNotification = async (notification: NotificationData) => {
    if (!notification.isRead) {
      await notificationApi.getById(notification.id)
      mutateUnRead()
      mutateRead()
    }
    const redirectPath = notification.orderId
      ? PATH_CES.order.detail(notification.orderId)
      : PATH_CES.debt.detail(notification.transactionId)
    push(redirectPath)
    setOpen(null)
  }

  return (
    <>
      <IconButtonAnimate
        color={open ? 'primary' : 'default'}
        onClick={handleOpen}
        sx={{ width: 40, height: 40 }}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="eva:bell-fill" width={24} height={24} />
        </Badge>
      </IconButtonAnimate>

      <MenuPopover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        sx={{ width: 400, p: 0, height: 0.9, overflow: 'hidden' }}
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
                <NotificationItem
                  key={item.id}
                  notification={item}
                  handleClick={() => handleClickNotification(item)}
                />
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
                <NotificationItem
                  key={item.id}
                  notification={item}
                  handleClick={() => handleClickNotification(item)}
                />
              ))}
            </List>
          )}
        </Scrollbar>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 2 }} />
      </MenuPopover>
    </>
  )
}

// ----------------------------------------------------------------------

function NotificationItem({
  notification,
  handleClick,
}: {
  notification: NotificationData
  handleClick?: any
}) {
  const { avatar, title } = renderContent(notification)

  return (
    <ListItemButton
      onClick={() => handleClick?.()}
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
