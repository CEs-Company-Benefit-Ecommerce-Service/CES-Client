// @mui
import { Stack, Typography } from '@mui/material'
// utils
import { fCurrency } from '../../../../utils/formatNumber'
import { fDateVN } from '../../../../utils/formatTime'
// @types
// components
import { MonthlyOrder } from 'src/@types/@ces'
import LoadingTable from 'src/utils/loadingTable'

// ----------------------------------------------------------------------

type Props = {
  order?: MonthlyOrder
  isLoading: boolean
}

export default function AccountOrderHistory({ order,isLoading }: Props) {
  return (
    <Stack spacing={3} sx={{ p: 3 }} alignItems="flex-end">
      <Typography variant="subtitle1" sx={{ width: 1 }}>
        Orders in month
      </Typography>

      <Stack spacing={2} sx={{ width: 1 }}>
        <LoadingTable isValidating={isLoading} />
        {order?.orders?.length == 0 ? (
          <Typography variant="caption">No order yet!</Typography>
        ) : (
          order?.orders?.map((x) => (
            <Stack key={x.id} direction="row" justifyContent="space-between" sx={{ width: 1 }}>
              <Typography variant="body2">{x.orderCode}</Typography>
              <Typography variant="body2">{x.employeeName}</Typography>
              <Typography variant="body2">{fDateVN(x.createdAt)}</Typography>
              <Typography variant="body2">{fCurrency(x.total)}</Typography>
            </Stack>
          ))
        )}
      </Stack>

      {/* <Button size="small" endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}>
        All history
      </Button> */}
    </Stack>
  )
}
