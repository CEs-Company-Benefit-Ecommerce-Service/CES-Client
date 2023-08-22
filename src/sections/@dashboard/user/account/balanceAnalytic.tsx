// @mui
import { Box, Stack, Typography } from '@mui/material'
import { fCurrency, fNumber } from 'src/utils/formatNumber'
// utils

// ----------------------------------------------------------------------

type Props = {
  icon: string
  title?: string
  balance: number
  limit: number
  color?: string
}

export default function BalanceAnalytic({ title, balance, limit, color }: Props) {
  return (
    <Stack
      direction="row"
      alignItems="left"
      justifyContent="left"
      sx={{ py: 2, width: 1, minWidth: 200 }}
    >
      <Stack spacing={0.5} sx={{ ml: 2 }}>
        <Typography variant="h5">{title}</Typography>

        <Typography variant="h5" sx={{ color }}>
          {fNumber(balance)}
          <Box component="span" sx={{ color: 'text.secondary', typography: 'body1' }}>
            /{fCurrency(limit)}
          </Box>
        </Typography>
      </Stack>
    </Stack>
  )
}
