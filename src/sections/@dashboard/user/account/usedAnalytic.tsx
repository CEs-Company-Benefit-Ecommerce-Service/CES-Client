// @mui
import { LoadingButton } from '@mui/lab'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary, Paper,
  Stack, Typography
} from '@mui/material'
import { useState } from 'react'
import { AccountData, PaymentPayload } from 'src/@types/@ces'
import { paymentApi } from 'src/api-client/payment'
import Iconify from 'src/components/Iconify'
import { fCurrency } from 'src/utils/formatNumber'
import Image from '../../../../components/Image'
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

export default function UsedAnalytic({ title, used, color, data, payLoad, setOpen }: Props) {
  const [zaloPay, setZaloPay] = useState(false)
  const [vnPay, setVnPay] = useState(true)
  const [banking, setBanking] = useState(false)

  const [loading, setLoading] = useState(false)

  async function handlePayment() {
    payLoad.paymentid = vnPay
      ? '4c6aefa8-9fcf-4e46-9370-bebdef6ea55c'
      : '05C93858-F520-4391-B72B-D48BC5F2990B'
    try {
      setLoading(true)
      await paymentApi.pay(payLoad).then((res) => {
        window.open(res.data?.url, '_blank', 'noopener,noreferrer')
        // window.location.href = `${res.data?.url}`
      })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  //

  return (
    <Accordion>
      <AccordionSummary
        disableRipple={true}
        disableTouchRipple={true}
        expandIcon={<Iconify icon={'eva:arrow-ios-downward-fill'} width={20} height={20} />}
      >
        <Stack spacing={0.5}>
          <Typography variant="h5">{title}</Typography>
          <Typography variant="h5" sx={{ color, fontSize: 24 }}>
            {fCurrency(used)}đ
          </Typography>
          {/* <Typography variant="body2">Expired date: 10/08/2023</Typography> */}
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          <Stack direction="row" alignItems="left" justifyContent="space-between">
            <Stack
              spacing={0.5}
              direction="row"
              justifyContent="space-between"
              sx={{ width: 1, minWidth: 200 }}
            >
              <Typography variant="overline">Payment Method </Typography>
            </Stack>
          </Stack>
          <Stack spacing={2} sx={{ py: 3 }} direction={{ xs: 'column', md: 'row' }}>
            <>
              <Paper
                onClick={() => {
                  setVnPay(true)
                  setZaloPay(false)
                  setBanking(false)
                }}
                sx={{
                  p: 3,
                  width: 1,
                  borderRadius: '8px',
                  position: 'relative',
                  border: (theme) =>
                    `solid 4px  ${vnPay ? theme.palette.primary.main : theme.palette.grey[50032]}`,
                }}
              >
                <Image alt="icon" src={'/vnpay.svg'} sx={{ mb: 1, maxWidth: 72 }} />
                {/* <Typography variant="subtitle1">{fCurrency(used)}đ</Typography> */}
              </Paper>
              <Paper
                onClick={() => {
                  setZaloPay(true)
                  setVnPay(false)
                  setBanking(false)
                }}
                sx={{
                  p: 3,
                  width: 1,
                  borderRadius: '8px',
                  position: 'relative',
                  border: (theme) =>
                    `solid 4px  ${
                      zaloPay ? theme.palette.primary.main : theme.palette.grey[50032]
                    }`,
                }}
              >
                <Image alt="icon" src={'/zalopay.svg'} sx={{ mb: 1, maxWidth: 72 }} />
                {/* <Typography variant="subtitle1">{fCurrency(used)}đ</Typography> */}
              </Paper>
              <Paper
                onClick={() => {
                  setZaloPay(false)
                  setVnPay(false)
                  setBanking(true)
                  setOpen(true)
                }}
                sx={{
                  p: 3,
                  width: 1,
                  borderRadius: '8px',
                  position: 'relative',
                  border: (theme) =>
                    `solid 4px  ${
                      banking ? theme.palette.primary.main : theme.palette.grey[50032]
                    }`,
                }}
              >
                <Image alt="icon" src={'/onlineBanking.png'} sx={{ mb: 1, maxWidth: 36 }} />
                {/* <Typography variant="subtitle1">{fCurrency(used)}đ</Typography> */}
              </Paper>
            </>
          </Stack>

          <Stack>
            <LoadingButton loading={loading} variant="contained" onClick={handlePayment}>
              Payment
            </LoadingButton>
          </Stack>
        </Typography>
      </AccordionDetails>
    </Accordion>
  )
}
