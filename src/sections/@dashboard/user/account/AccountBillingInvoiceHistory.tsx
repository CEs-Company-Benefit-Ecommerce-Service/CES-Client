// @mui
import { Box, Button, Stack, Typography, useTheme } from '@mui/material'
import { useRouter } from 'next/router'
import { TransactionHistory } from 'src/@types/@ces'
import Iconify from 'src/components/Iconify'
import { PATH_CES } from 'src/routes/paths'
import LoadingTable from 'src/utils/loadingTable'
// utils
import { fCurrency } from '../../../../utils/formatNumber'
import { fDateVN, fTime } from '../../../../utils/formatTime'

// ----------------------------------------------------------------------

type Props = {
  Transactions?: TransactionHistory[]
  isLoading: boolean
}

export default function AccountBillingInvoiceHistory({ Transactions, isLoading }: Props) {
  const { push } = useRouter()
  const theme = useTheme()
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
              <Stack flex={1}>
                {' '}
                <Box
                  flex={1}
                  // variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  sx={{
                    textTransform: 'capitalize',
                    color:
                      x.status === 1
                        ? theme.palette.primary.main
                        : x.status === 3
                        ? theme.palette.info.main
                        : x.status === 0
                        ? theme.palette.warning.main
                        : theme.palette.error.main,
                  }}
                >
                  {x.status === 1
                    ? 'Success'
                    : x.status === 2
                    ? 'Cancel'
                    : x.status === 0
                    ? 'New'
                    : 'Processing'}
                </Box>{' '}
              </Stack>
              <Typography flex={1} variant="body2">
                {fCurrency(x.total)}
              </Typography>
              <Typography flex={1}>
                {x.type == 3 ? 'ZaloPay' : x.type == 6 ? 'Banking' : 'VnPay'}
              </Typography>
              <Stack direction="column" flex={1.2}>
                <Typography variant="body2">{fDateVN(x.createdAt)}</Typography>
                <Typography variant="body2">{fTime(x.createdAt)}</Typography>
              </Stack>
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
