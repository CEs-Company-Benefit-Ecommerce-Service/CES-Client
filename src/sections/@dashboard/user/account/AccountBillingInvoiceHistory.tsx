// @mui
import { Button, Stack, Typography } from '@mui/material'
import { TransactionHistory } from 'src/@types/@ces'
import LoadingTable from 'src/utils/loadingTable'
// utils
import { fCurrency } from '../../../../utils/formatNumber'
import { fDate, fDateTime, fDateTimeParam, fDateVN, fTime } from '../../../../utils/formatTime'
import Iconify from 'src/components/Iconify'
import { useRouter } from 'next/router'
import { PATH_CES } from 'src/routes/paths'

// ----------------------------------------------------------------------

type Props = {
  Transactions?: TransactionHistory[]
  isLoading: boolean
}

export default function AccountBillingInvoiceHistory({ Transactions, isLoading }: Props) {
  const { push } = useRouter()

  return (
    <Stack spacing={3} alignItems="flex-end">
      <Typography variant="subtitle1" sx={{ width: 1 }}>
        Payment History
      </Typography>
      <Stack spacing={2} sx={{ width: 1 }}>
        <LoadingTable isValidating={isLoading} />
        {Transactions?.length == 0 ? (
          <Typography variant="caption">No payment yet!</Typography>
        ) : (
          Transactions?.map((x) => (
            <Stack key={x.id} direction="row" justifyContent="space-between" sx={{ width: 1 }}>
              <Stack direction="column" flex={1}>
                <Typography variant="body2">{fDateVN(x.createdAt)}</Typography>
                <Typography flex={1.8} variant="body2">
                  {fTime(x.createdAt)}
                </Typography>
              </Stack>
              {/* <Typography flex={1.8} variant="body2">
                {fDateTime(x.createdAt)}
              </Typography> */}
              <Typography flex={1} variant="body2">
                {fCurrency(x.total)}
              </Typography>
              <Typography flex={1}>
                {x.type == 3 ? 'ZALOPAY' : x.type == 6 ? 'BANKING' : 'VNPAY'}
              </Typography>
            </Stack>
          ))
        )}
      </Stack>
      <Button
        size="small"
        endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
        onClick={() => push(PATH_CES.transaction.root)}
      >
        View all history
      </Button>
    </Stack>
  )
}
