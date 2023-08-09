// @mui
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import Image from 'next/image'
import { useSnackbar } from 'notistack'
import { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { AccountData, PaymentPayload, TransactionPayload } from 'src/@types/@ces'
import { paymentApi } from 'src/api-client/payment'
import { RHFTextField, RHFUploadAvatar } from 'src/components/hook-form'
import { useMe } from 'src/hooks/@ces'
import { usePayment } from 'src/hooks/@ces/usePayment'
import uploadImageDebt from 'src/utils/uploadImageDebt'
// @types
import { CreditCard, UserAddressBook, UserInvoice } from '../../../../@types/user'
import AccountBillingInvoiceHistory from './AccountBillingInvoiceHistory'
import BalanceAnalytic from './balanceAnalytic'
import UsedAnalytic from './usedAnalytic'

// ----------------------------------------------------------------------

type Props = {
  cards: CreditCard[]
  invoices: UserInvoice[]
  addressBook: UserAddressBook[]
  data?: AccountData
  payload?: PaymentPayload
}

export default function AccountBilling({ cards, addressBook, invoices, payload }: Props) {
  const { data } = useMe({})
  const usedPayload = data?.wallets.map((u) => u?.used)[0]
  const balance = data?.wallets.map((u) => u?.balance)[0]
  const limit = data?.wallets.map((u) => u?.limits)[0]
  const accountId = data?.id
  const compId = data?.companyId.toString()
  const [open, setOpen] = useState(false)
  // const { data: orders, isLoading } = useOrderByCompanyId({ companyId: compId })
  const { data: payments, isLoading: isPaymentLoading } = usePayment({
    companyId: compId,
    params: { PaymentType: '1', Sort: 'createdAt', Order: 'desc', Page: 1, Size: 10 },
  })

  payload = {
    used: usedPayload,
    accountId: accountId!,
    paymentid: '05C93858-F520-4391-B72B-D48BC5F2990B',
  }
  const theme = useTheme()

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={7}>
        <Stack spacing={2}>
          {open && <BankingDetails handleClose={() => setOpen(false)} used={usedPayload!} />}
          <Card sx={{ mb: 1 }}>
            <BalanceAnalytic
              title="Balance"
              balance={balance!}
              limit={limit!}
              icon="ic:round-receipt"
              color={theme.palette.success.main}
            />
          </Card>
          <Card sx={{ mb: 2 }}>
            <UsedAnalytic
              color={theme.palette.info.main}
              title="Used"
              used={usedPayload!}
              data={data}
              payLoad={payload}
              setOpen={setOpen}
            />
          </Card>
        </Stack>

        {/* <Card sx={{ mt: 5 }}>
          <AccountOrderHistory order={orders?.data} isLoading={isLoading} />
        </Card> */}
      </Grid>
      <Grid item xs={12} md={5}>
        <AccountBillingInvoiceHistory Transactions={payments?.data} isLoading={isPaymentLoading} />
      </Grid>
    </Grid>
  )
}

type BankingDetailsProps = {
  handleClose: any
  used: number
}

function BankingDetails({ handleClose, used }: BankingDetailsProps) {
  const [open, setOpen] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const defaultValues = {
    total: used,
    imageUrl: '',
  }

  const methods = useForm<TransactionPayload>({ defaultValues })

  const { setValue, handleSubmit } = methods

  const handleCreateTransactionSubmit = async (payload: TransactionPayload) => {
    try {
      paymentApi.createPaymentDebt(payload)
      handleClose()
      enqueueSnackbar('Create success!')
    } catch (error) {
      enqueueSnackbar('Create failed!')
      console.error(error)
    }
  }

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      uploadImageDebt({ acceptedFiles, setValue })
    },
    [setValue]
  )
  return (
    <Dialog fullWidth maxWidth="xs" open onClose={handleClose}>
      <DialogTitle>Banking Details</DialogTitle>

      <DialogContent sx={{ mt: 1, m: '0 auto' }}>
        {open ? (
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(handleCreateTransactionSubmit)}>
              <Card sx={{ py: 4, px: 3, mt: 2 }}>
                <RHFTextField name="total" label="Total" disabled />
                <Box sx={{ mb: 3, mt: 2 }}>
                  <RHFUploadAvatar
                    name="imageUrl"
                    accept="image/*"
                    maxSize={3145728}
                    onDrop={handleDrop}
                    helperText={
                      <Typography
                        variant="caption"
                        sx={{
                          mt: 2,
                          mx: 'auto',
                          display: 'block',
                          textAlign: 'center',
                          color: 'text.secondary',
                        }}
                      >
                        Allowed *.jpeg, *.jpg, *.png, *.gif
                        <br /> max size of
                      </Typography>
                    }
                  />
                </Box>
              </Card>
              <DialogActions>
                <Button type="submit" variant="contained">
                  Send
                </Button>
              </DialogActions>
            </form>
          </FormProvider>
        ) : (
          <Image src="/banking.png" alt="banking" width={300} height={400} />
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
        {open ? null : (
          <Button
            onClick={() => {
              setOpen(true)
            }}
          >
            Payment
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}
