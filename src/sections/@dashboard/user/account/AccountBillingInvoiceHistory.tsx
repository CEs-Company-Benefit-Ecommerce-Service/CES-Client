// @mui
import { Button, Stack, Typography } from '@mui/material'
// utils
import { fCurrency } from '../../../../utils/formatNumber'
import { fDate } from '../../../../utils/formatTime'
// @types
import { UserInvoice } from '../../../../@types/user'
// components
import { usePayment } from 'src/hooks/@ces/usePayment'
import Iconify from '../../../../components/Iconify'

// ----------------------------------------------------------------------

type Props = {
  invoices?: UserInvoice[]
}

export default function AccountBillingInvoiceHistory({ invoices }: Props) {
  const { data } = usePayment({})
  return (
    <Stack spacing={3} alignItems="flex-end">
      <Typography variant="subtitle1" sx={{ width: 1 }}>
        Payment History
      </Typography>

      <Stack spacing={2} sx={{ width: 1 }}>
        {data?.data?.map((x) => (
          <Stack key={x.id} direction="row" justifyContent="space-between" sx={{ width: 1 }}>
            <Typography variant="body2" sx={{ minWidth: 160 }}>
              {fDate(x.createdAt)}
            </Typography>
            <Typography variant="body2">{fCurrency(x.total)} đ</Typography>
            <Typography>Zalo Pay</Typography>
          </Stack>
        ))}
      </Stack>

      <Button size="small" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
        All history
      </Button>
    </Stack>
  )
}
