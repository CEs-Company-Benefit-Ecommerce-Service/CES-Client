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
    InputAdornment,
    Typography
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
// layouts
import Image from 'next/image'
import { useSnackbar } from 'notistack'
import { useCallback, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { PaymentPayload, TransactionPayload } from 'src/@types/@ces'
import { paymentApi } from 'src/api-client/payment'
import { RHFTextField, RHFUploadSingleFile } from 'src/components/hook-form'
import { useMe } from 'src/hooks/@ces'
import { usePayment } from 'src/hooks/@ces/usePayment'
import Layout from 'src/layouts'
import { AccountBillingInvoiceHistory } from 'src/sections/@dashboard/user/account'
import PaymentMethod from 'src/sections/@dashboard/user/account/paymentMethod'
// sections
import { PaymentSummary } from 'src/sections/payment'
import uploadImageDebt from 'src/utils/uploadImageDebt'

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  minHeight: '100%',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10),
}))

// ----------------------------------------------------------------------

PaymentDebt.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout variant="logoOnly">{page}</Layout>
}

// ----------------------------------------------------------------------
interface PaymentDebtProps {
  payload?: PaymentPayload
}
export default function PaymentDebt({ payload }: PaymentDebtProps) {
  const [open, setOpen] = useState(false)
  const { data } = useMe({})
  const compId = data?.companyId?.toString()
  const wallets = data?.wallets || []
  const used = wallets[0]?.used
  const accountId = data?.id
  const { data: payments, isLoading: isPaymentLoading } = usePayment({
    companyId: compId,
    params: { PaymentType: '1', Sort: 'createdAt', Order: 'desc', Page: 1, Size: 10 },
  })

  payload = {
    used: used,
    accountId: accountId!,
    paymentid: '05C93858-F520-4391-B72B-D48BC5F2990B',
  }
  const theme = useTheme()
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        {open && <BankingDetails handleClose={() => setOpen(false)} used={used!} />}
        <Box
          sx={{
            display: 'grid',
            gap: 5,
            p: { md: 5 },
            borderRadius: 2,
            border: (theme) => ({ md: `dashed 1px ${theme.palette.divider}` }),
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          }}
        >
          <PaymentSummary wallets={wallets} account={data!} />

          <PaymentMethod
            color={theme.palette.info.main}
            used={used!}
            payLoad={payload}
            setOpen={setOpen}
          />

          {/* <PaymentBillingAddress /> */}
          {/* <PaymentMethods /> */}
        </Box>
      </Grid>
      <Grid item xs={12} md={4}>
        <AccountBillingInvoiceHistory Transactions={payments?.data} isLoading={isPaymentLoading} />

        {/* <PaymentSummary /> */}
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
                <RHFTextField
                  name="total"
                  label="Total"
                  disabled
                  InputProps={{
                    endAdornment: <InputAdornment position="start">đ</InputAdornment>,
                  }}
                />
                <Box sx={{ mb: 3, mt: 2 }}>
                  <RHFUploadSingleFile
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
