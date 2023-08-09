// @mui
import { Card, Grid, Stack, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { AccountPayload, CompanyPayload } from 'src/@types/@ces'
import { accountApi, companyApi } from 'src/api-client'
import Image from 'src/components/Image'
import { useAccountDetails, useCompanyDetails } from 'src/hooks/@ces'
import { fNumber } from 'src/utils/formatNumber'
import AccountNewEditForm from '../../account/AccountNewEditForm'
import CompanyNewEditForm from '../CompanyNewEditForm'

// ----------------------------------------------------------------------

type Props = {
  accountId?: string
  companyId: string
}

export default function CompanyGeneral({ accountId, companyId }: Props) {
  const { enqueueSnackbar } = useSnackbar()

  const { data, mutate: mutateCompany } = useCompanyDetails({ id: `${companyId}` })
  const { data: accountDetails, mutate: mutateAccount } = useAccountDetails({
    enable: Boolean(data?.data?.contactPersonId),
    id: data?.data?.contactPersonId,
  })

  const handleEditCompanySubmit = async (payload: CompanyPayload) => {
    try {
      await companyApi.update(`${companyId}`, payload)
      mutateCompany()
      enqueueSnackbar('Update success!')
    } catch (error) {
      enqueueSnackbar('Update failed!', { variant: 'error' })
      console.error(error)
    }
  }
  const handleEditAccountSubmit = async (payload: AccountPayload) => {
    try {
      await accountApi.update(`${companyId}`, payload)
      mutateAccount()
      enqueueSnackbar('Update success!')
    } catch (error) {
      enqueueSnackbar('Update failed!', { variant: 'error' })
      console.error(error)
    }
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <CompanyNewEditForm isEdit currentUser={data?.data} onSubmit={handleEditCompanySubmit} />
      </Grid>
      <Grid item xs={12}>
        <AccountNewEditForm
          isEdit
          currentUser={accountDetails?.data}
          onSubmit={handleEditAccountSubmit}
        />
      </Grid>
      <Grid item xs={12} md={12}>
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

                <Stack direction={'row'} alignItems={'center'}>
                  <Typography variant="h6" flex={1}>
                    {fNumber(wallet.balance)} / {fNumber(wallet.limits)}đ
                  </Typography>
                  <Stack direction={'row'} spacing={1} flex={1}>
                    <Typography variant="h6">Used:</Typography>
                    <Typography variant="h6">{fNumber(wallet.used)}đ</Typography>
                  </Stack>
                </Stack>
              </Card>
            ))}
        </Stack>
      </Grid>
    </Grid>
  )
}
