// @mui
import { Divider, Stack, Switch, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { AccountData, WalletData } from 'src/@types/@ces'
import { fCurrency } from 'src/utils/formatNumber'
// components
import Label from '../../components/Label'

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  padding: theme.spacing(5),
  backgroundColor: theme.palette.background.neutral,
  borderRadius: Number(theme.shape.borderRadius) * 2,
}))

// ----------------------------------------------------------------------
interface PaymentSummaryProps {
  wallets: WalletData[]
  account: AccountData
}
export default function PaymentSummary({ wallets, account }: PaymentSummaryProps) {
  const used = wallets[0]?.used
  return (
    <RootStyle>
      <Typography variant="subtitle1" sx={{ mb: 5 }}>
        Summary
      </Typography>

      <Stack spacing={2.5}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle2" component="p" sx={{ color: 'text.secondary' }}>
            Company Name
          </Typography>

          <Label color="default" variant="filled">
            {account?.company?.name}
          </Label>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle2" component="p" sx={{ color: 'text.secondary' }}>
            Contact
          </Typography>

          <Label variant="filled">{account?.phone}</Label>
        </Stack>

        <Stack direction="row" justifyContent="space-between">
          <Typography component="p" variant="subtitle2" sx={{ color: 'text.secondary' }}>
            Billed Monthly
          </Typography>
          <Switch defaultChecked />
        </Stack>

        <Stack direction="row" justifyContent="flex-end">
          {/* <Typography sx={{ color: 'text.secondary' }}>$</Typography> */}

          <Typography variant="h2" sx={{ mx: 1 }}>
            {fCurrency(used)}
          </Typography>

          {/* <Typography
            component="span"
            variant="body2"
            sx={{ mb: 1, alignSelf: 'flex-end', color: 'text.secondary' }}
          >
            /mo
          </Typography> */}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="p">
            Total Billed
          </Typography>

          <Typography variant="h6" component="p">
            {fCurrency(used)}
          </Typography>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed', mb: 1 }} />
      </Stack>

      {/* <Typography variant="caption" sx={{ color: 'text.secondary', mt: 1 }}>
        * Plus applicable taxes
      </Typography> */}

      {/* <LoadingButton fullWidth size="large" type="submit" variant="contained" sx={{ mt: 5, mb: 3 }}>
        Upgrade My Plan
      </LoadingButton>

      <Stack alignItems="center" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Iconify icon={'eva:shield-fill'} sx={{ width: 20, height: 20, color: 'primary.main' }} />
          <Typography variant="subtitle2">Secure credit card payment</Typography>
        </Stack>

        <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          This is a secure 128-bit SSL encrypted payment
        </Typography>
      </Stack> */}
    </RootStyle>
  )
}
