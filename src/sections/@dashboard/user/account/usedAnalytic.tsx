// @mui
import { Stack, Typography } from '@mui/material'
import { AccountData, PaymentPayload } from 'src/@types/@ces'
import useAuth from 'src/hooks/useAuth'
import { fCurrency } from 'src/utils/formatNumber'
import { fDateVN } from 'src/utils/formatTime'
// utils

// ----------------------------------------------------------------------

type Props = {
  title?: string
  used: number
  payLoad: PaymentPayload
  data?: AccountData
  color: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function UsedAnalytic({ title, used, color }: Props) {
  const { user } = useAuth()
  const exDate = user?.expiredDate
  return (
    <Stack direction="row" alignItems="left" justifyContent="left" sx={{ width: 1, minWidth: 200 }}>
      <Stack spacing={0.5}>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="h5" sx={{ color, fontSize: 24 }}>
          {fCurrency(used)}
        </Typography>
        <Typography variant="body2">Expired Date: {fDateVN(exDate!)}</Typography>
      </Stack>
    </Stack>
  )
}
