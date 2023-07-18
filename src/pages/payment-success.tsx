import {
  Button,
  CircularProgress,
  Container,
  Stack,
  styled,
  Typography,
  useTheme,
} from '@mui/material'
import NextLink from 'next/link'
import React from 'react'
import Iconify from 'src/components/Iconify'
import Page from 'src/components/Page'
import Layout from 'src/layouts'
import { PATH_DASHBOARD } from 'src/routes/paths'

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100%',
  paddingTop: theme.spacing(30),
  paddingBottom: theme.spacing(10),
}))

PaymentSuccess.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="logoOnly">{page}</Layout>
}

function PaymentSuccess() {
  const theme = useTheme()
  // const { push } = useRouter()
  return (
    <Page title="Payment Success">
      <RootStyle>
        <Container>
          <Stack alignItems="center" justifyContent="center" sx={{ position: 'relative' }}>
            <Iconify
              icon={'eva:checkmark-circle-2-fill'}
              sx={{
                color: theme.palette.success.main,
                width: '4em',
                height: '4em',
                position: 'absolute',
              }}
            />

            <CircularProgress
              variant="determinate"
              value={100}
              size={56}
              thickness={4}
              sx={{ color: theme.palette.success.main }}
            />

            <CircularProgress
              variant="determinate"
              value={100}
              size={56}
              thickness={4}
              sx={{ color: 'grey.50016', position: 'absolute', top: 0, left: 0, opacity: 0.48 }}
            />
          </Stack>
          <Stack sx={{ mt: 4, position: 'relative', alignItems: 'center' }}>
            <Typography variant="h4" align="center" paragraph>
              Congrats on your payment success!!
            </Typography>
            <Typography align="center" sx={{ color: 'text.secondary' }}>
              Contact us if anything is wrong.
            </Typography>
            <NextLink href={PATH_DASHBOARD.root} passHref>
              <Button variant="contained" size="large" sx={{ mt: 5, mb: 3 }}>
                Homepage
              </Button>
            </NextLink>
          </Stack>
        </Container>
      </RootStyle>
    </Page>
  )
}

export default PaymentSuccess
