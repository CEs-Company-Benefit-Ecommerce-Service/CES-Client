import { useEffect, useState } from 'react'
import * as Yup from 'yup'
// @mui
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
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
  TextField,
  Typography,
} from '@mui/material'
import { useSnackbar } from 'notistack'
import { useForm } from 'react-hook-form'
import { AccountData, Role, UpdateWalletBalancePayLoad, WalletData } from 'src/@types/@ces'
import { walletApi } from 'src/api-client'
import Image from 'src/components/Image'
import { FormProvider, RHFSelect } from 'src/components/hook-form'
import { useAccountDetails, useBenefitList } from 'src/hooks/@ces'
import useAuth from 'src/hooks/useAuth'
import { AccountBillingInvoiceHistory } from 'src/sections/@dashboard/user/account'
import { confirmDialog } from 'src/utils/confirmDialog'
import { fCurrency, fNumber } from 'src/utils/formatNumber'

// ----------------------------------------------------------------------

type Props = {
  mutate?: any
  // invoices: UserInvoice[]
  currentUser?: AccountData
  accountId?: string
}

export default function AccountWallet({ currentUser, mutate, accountId }: Props) {
  const { enqueueSnackbar } = useSnackbar()

  const [openWallet, setOpenWallet] = useState(false)
  const [currentWallet, setCurrentWallet] = useState<WalletData>()
  const [loading, setLoading] = useState(false)

  const { user } = useAuth()
  const { data: benefitList } = useBenefitList({})
  const { data: accountDetails } = useAccountDetails({ id: `${accountId}` })

  const handleClickOpen = (wallet: WalletData) => {
    setCurrentWallet(wallet)
    setOpenWallet(true)
  }

  const handleClose = () => {
    setOpenWallet(false)
  }

  const NewUserSchema = Yup.object().shape({
    benefitId: Yup.string().required('Benefit is required'),
  })

  const defaultValues = {
    balance: 0,
  }

  const methods = useForm<UpdateWalletBalancePayLoad>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  })

  const {
    // setValue,
    reset,
    watch,
    handleSubmit,
    // formState: { isSubmitting },
  } = methods

  useEffect(() => {
    if (currentWallet) {
      reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentWallet])

  const onSubmit = async (payload: UpdateWalletBalancePayLoad) => {
    confirmDialog('', async () => {
      try {
        setLoading(true)

        await walletApi.updateBalanceV2({
          benefitId: payload.benefitId,
          id: currentWallet?.id || '',
          type: 1,
          balance: 0,
        })

        await mutate()

        enqueueSnackbar(`Update wallet ${currentWallet?.name} success!`)
      } catch (error) {
        enqueueSnackbar('Update failed!', { variant: 'error' })
        console.error(error)
      } finally {
        setLoading(false)
        handleClose()
      }
    })
  }

  return (
    <Grid container spacing={5}>
      <Grid item xs={12} md={8}>
        <Stack spacing={3}>
          {accountDetails?.data?.wallets &&
            accountDetails?.data?.wallets.map((wallet) => (
              <Card key={wallet.id} sx={{ p: 3 }}>
                <Stack direction={'row'} alignItems={'center'} spacing={1} mb={3}>
                  <Image alt="icon" src={'/assets/icons/ic_wallet.png'} sx={{ maxWidth: 36 }} />
                  <Typography
                    variant="overline"
                    sx={{ mb: 3, display: 'block', color: 'text.secondary' }}
                  >
                    {wallet.name}
                  </Typography>
                </Stack>

                {user?.role === Role['Enterprise Admin'] ? (
                  <>
                    <Typography variant="h6" flex={1}>
                      {fNumber(wallet.balance)} đ
                    </Typography>
                    <Box
                      sx={{
                        mt: { xs: 2, sm: 0 },
                        position: { sm: 'absolute' },
                        top: { sm: 24 },
                        right: { sm: 24 },
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleClickOpen(wallet)}
                      >
                        Add fund
                      </Button>
                    </Box>
                  </>
                ) : (
                  <Stack direction={'row'} alignItems={'center'}>
                    <Typography variant="h6" flex={1}>
                      {fNumber(wallet.balance)} / {fNumber(wallet.limits)} đ
                    </Typography>
                    <Stack direction={'row'} spacing={1} flex={1}>
                      <Typography variant="h6">Used:</Typography>
                      <Typography variant="h6">{fNumber(wallet.used)} đ</Typography>
                    </Stack>
                  </Stack>
                )}
              </Card>
            ))}
        </Stack>
      </Grid>

      <Dialog open={openWallet} onClose={handleClose} fullWidth>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Add funds</DialogTitle>
          <DialogContent>
            <RHFSelect sx={{ my: 2 }} name="benefitId" label="Benefit" placeholder="Benefit">
              <option value={undefined} />
              {benefitList?.data?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.name}
                </option>
              ))}
            </RHFSelect>

            <TextField
              fullWidth
              disabled
              value={
                benefitList?.data?.find((x) => x.id === watch('benefitId'))?.unitPrice !== undefined
                  ? fCurrency(
                      benefitList?.data?.find((x) => x.id === watch('benefitId'))?.unitPrice || 0
                    )
                  : fCurrency(0)
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="inherit">
              Cancel
            </Button>
            <LoadingButton type="submit" variant="contained" loading={loading}>
              Add
            </LoadingButton>
          </DialogActions>
        </FormProvider>
      </Dialog>

      <Grid item xs={12} md={4}>
        {user?.role == Role['System Admin'] && <AccountBillingInvoiceHistory />}
      </Grid>
    </Grid>
  )
}
