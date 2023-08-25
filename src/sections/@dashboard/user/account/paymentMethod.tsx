// @mui
import { LoadingButton } from '@mui/lab'
import { Paper, Stack, Switch, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import React from 'react'
import { useState } from 'react'
import { PaymentPayload } from 'src/@types/@ces'
import { paymentApi } from 'src/api-client/payment'
import { confirmDialog } from 'src/utils/confirmDialog'
import Image from '../../../../components/Image'
// utils

// ----------------------------------------------------------------------

type Props = {
  used: number
  payLoad: PaymentPayload
  color: string
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  isDebt?: boolean
  compId?: string
}

export default function PaymentMethod({ compId, payLoad, setOpen, used, isDebt }: Props) {
  const [paymentMethods, setPaymentMethods] = useState({
    zaloPay: false,
    vnPay: false,
    banking: false,
  })

  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [checked, setChecked] = React.useState(false)
  const handleChange = () => {
    confirmDialog('Do you really want to reset employee wallet?', () => {
      setChecked(true)
    })
  }

  async function handlePayment() {
    payLoad.paymentid = paymentMethods.vnPay
      ? '4c6aefa8-9fcf-4e46-9370-bebdef6ea55c'
      : '05C93858-F520-4391-B72B-D48BC5F2990B'
    try {
      setLoading(true)
      await paymentApi.pay(payLoad).then((res) => {
        window.open(res.data?.url, '_blank', 'noopener,noreferrer')
        // window.location.href = `${res.data?.url}`
      })
      if (checked) {
        await paymentApi.reset({ companyId: compId! })
        enqueueSnackbar('Reset successfull')
        setChecked(true)
      }
    } catch (error) {
      enqueueSnackbar('Reset failed', { variant: 'error' })
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  //

  return (
    <Stack sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems={'center'} pb={2}>
        <Typography component="p" variant="subtitle1">
          Reset Wallet
        </Typography>
        <Switch checked={checked} onChange={handleChange} />
      </Stack>
      <Typography>
        <Stack direction="row" alignItems="left" justifyContent="space-between">
          <Stack
            spacing={0.5}
            direction="row"
            justifyContent="space-between"
            sx={{ width: 1, minWidth: 200 }}
          >
            <Typography variant="subtitle1">Payment Method</Typography>
          </Stack>
        </Stack>

        <Stack spacing={2} sx={{ pt: 4 }} direction={{ xs: 'column', md: 'row' }}>
          <>
            <Paper
              onClick={() => {
                setPaymentMethods({
                  vnPay: true,
                  zaloPay: false,
                  banking: false,
                })
              }}
              sx={{
                p: 3,
                width: 1,
                borderRadius: '8px',
                position: 'relative',
                border: (theme: any) =>
                  `solid 4px  ${
                    paymentMethods.vnPay ? theme.palette.primary.main : theme.palette.grey[50032]
                  }`,
              }}
            >
              {' '}
              <Stack
                direction={'row'}
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Typography variant="body2">Pay with VNPay</Typography>
                <Image alt="icon" src={'/vnpay.svg'} sx={{ maxWidth: 56, maxHeight: 15 }} />
              </Stack>
              {/* <Typography variant="subtitle1">{fCurrency(used)}</Typography> */}
            </Paper>
          </>
        </Stack>
        <Stack spacing={2} sx={{ pt: 2 }} direction={{ xs: 'column', md: 'row' }}>
          <>
            <Paper
              onClick={() => {
                setPaymentMethods({
                  vnPay: false,
                  zaloPay: true,
                  banking: false,
                })
              }}
              sx={{
                p: 3,
                width: 1,
                borderRadius: '8px',
                position: 'relative',
                border: (theme: any) =>
                  `solid 4px  ${
                    paymentMethods.zaloPay ? theme.palette.primary.main : theme.palette.grey[50032]
                  }`,
              }}
            >
              <Stack
                direction={'row'}
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Typography variant="body2">Pay with Zalo</Typography>
                <Image alt="icon" src={'/zalopay.svg'} sx={{ maxWidth: 56, maxHeight: 15 }} />
              </Stack>

              {/* <Typography variant="subtitle1">{fCurrency(used)}</Typography> */}
            </Paper>
          </>
        </Stack>
        <Stack spacing={2} sx={{ py: 2 }} direction={{ xs: 'column', md: 'row' }}>
          <>
            <Paper
              onClick={() => {
                setPaymentMethods({
                  vnPay: false,
                  zaloPay: false,
                  banking: true,
                })
                setOpen(used !== 0)
              }}
              sx={{
                p: 3,
                width: 1,
                borderRadius: '8px',
                position: 'relative',
                border: (theme: any) =>
                  `solid 4px  ${
                    paymentMethods.banking ? theme.palette.primary.main : theme.palette.grey[50032]
                  }`,
              }}
            >
              <Stack
                direction={'row'}
                sx={{ justifyContent: 'space-between', alignItems: 'center' }}
              >
                <Typography variant="body2">Banking</Typography>
                <Image alt="icon" src={'/onlineBanking.png'} sx={{ maxWidth: 22 }} />
              </Stack>
            </Paper>
          </>
        </Stack>

        <Stack>
          <LoadingButton
            loading={loading}
            disabled={used == 0 || isDebt}
            variant="contained"
            onClick={handlePayment}
          >
            {used == 0
              ? 'You have no debt to pay'
              : isDebt
              ? 'Current Debt is waiting for confirmation!! '
              : 'Payment'}
          </LoadingButton>
        </Stack>
      </Typography>
    </Stack>
  )
}
