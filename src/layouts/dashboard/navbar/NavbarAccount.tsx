// next
import NextLink from 'next/link'
// @mui
import { Box, Divider, Link, Stack, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
// hooks
import useAuth from '../../../hooks/useAuth'
// routes
import { PATH_DASHBOARD } from '../../../routes/paths'
// components
import { Role, WalletData } from 'src/@types/@ces'
import { useMe } from 'src/hooks/@ces'
import { fCurrency, fNumber } from 'src/utils/formatNumber'
import MyAvatar from '../../../components/MyAvatar'

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  // padding: theme.spacing(2, 2.5),
  // borderRadius: Number(theme.shape.borderRadius) * 1.5,
  // backgroundColor: theme.palette.grey[500_12],
  // transition: theme.transitions.create('opacity', {
  //   duration: theme.transitions.duration.shorter,
  // }),
}))

const RootStyle2 = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2, 2.5),
  borderRadius: Number(theme.shape.borderRadius) * 1.5,
  backgroundColor: theme.palette.grey[500_12],
  transition: theme.transitions.create('opacity', {
    duration: theme.transitions.duration.shorter,
  }),
}))

// ----------------------------------------------------------------------

type Props = {
  isCollapse: boolean | undefined
}

export default function NavbarAccount({ isCollapse }: Props) {
  const { user } = useAuth()
  const { data } = useMe({})
  return (
    <NextLink href={PATH_DASHBOARD.user.account} passHref>
      <Link underline="none" color="inherit">
        <RootStyle2
          sx={{
            ...(isCollapse && {
              bgcolor: 'transparent',
            }),
          }}
        >
          <RootStyle
            sx={{
              ...(isCollapse && {
                bgcolor: 'transparent',
              }),
            }}
          >
            <MyAvatar />

            <Box
              sx={{
                ml: 2,
                transition: (theme) =>
                  theme.transitions.create('width', {
                    duration: theme.transitions.duration.shorter,
                  }),
                ...(isCollapse && {
                  ml: 0,
                  width: 0,
                }),
              }}
            >
              {user && (
                <>
                  <Typography variant="subtitle2" noWrap>
                    {user.name}
                  </Typography>
                  <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
                    {Role[user.role]}
                  </Typography>
                </>
              )}
            </Box>
          </RootStyle>
          {!!data?.wallets?.length && (
            <Box
              sx={{
                transition: (theme) =>
                  theme.transitions.create('width', {
                    duration: theme.transitions.duration.shorter,
                  }),
                ...(isCollapse && {
                  ml: 0,
                  width: 0,
                  height: 0,
                }),
              }}
            >
              <Divider sx={{ my: 1 }} />

              {data?.wallets?.map((x: WalletData) => (
                <Box key={x.id}>
                  <Stack>
                    <Typography variant="body2" noWrap sx={{ color: 'text.primary' }}>
                      Balance:
                    </Typography>
                    <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
                      {fNumber(x.balance)} / {fCurrency(x.limits)}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography variant="body2" noWrap sx={{ color: 'text.primary' }}>
                      Used:
                    </Typography>
                    <Typography variant="body2" noWrap sx={{ color: 'text.secondary' }}>
                      {fCurrency(x.used)}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Box>
          )}
        </RootStyle2>
      </Link>
    </NextLink>
  )
}
