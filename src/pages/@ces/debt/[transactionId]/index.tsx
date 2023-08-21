// next
// @mui
import { Container } from '@mui/material'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { Role, TransactionUpdatePayload } from 'src/@types/@ces'
import { paymentApi } from 'src/api-client/payment'
import LoadingScreen from 'src/components/LoadingScreen'
import RoleBasedGuard from 'src/guards/RoleBasedGuard'
import { useCompanyDetails } from 'src/hooks/@ces'
import { useDebtDetail } from 'src/hooks/@ces/useDebt'
import DebtDetails from 'src/sections/@ces/transaction/detail'
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs'
// components
import Page from '../../../../components/Page'
// hooks
import useSettings from '../../../../hooks/useSettings'
// layouts
import Layout from '../../../../layouts'
// routes
import { PATH_CES } from '../../../../routes/paths'

// ----------------------------------------------------------------------

DebtDetail.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function DebtDetail() {
  const { themeStretch } = useSettings()
  // const { enqueueSnackbar } = useSnackbar()

  const { query } = useRouter()
  const { transactionId } = query
  const { data, isLoading, mutate } = useDebtDetail({ id: `${transactionId}` })
  const { data: company } = useCompanyDetails({ id: `${data?.data?.companyId}` })
  const { enqueueSnackbar } = useSnackbar()
  if (isLoading) {
    return <LoadingScreen />
  }
  
  const handleUpdateDebt = async (id: string, payload: TransactionUpdatePayload) => {
    try {
      await paymentApi.updateDebt(id, payload)
      mutate()
      enqueueSnackbar('Update success!')
    } catch (error) {
      enqueueSnackbar('Update failed!')
      console.error(error)
    }
  }

  return (
    <RoleBasedGuard hasContent roles={[Role['System Admin'], Role['Enterprise Admin']]}>
      <Page title="Debt: View">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Debt Details"
            links={[
              { name: 'Dashboard', href: PATH_CES.transaction.root },
              {
                name: 'Transaction',
                href: PATH_CES.transaction.root,
              },
              { name: `${transactionId}` || '' },
            ]}
          />

          <DebtDetails
            debt={data?.data}
            compId={company?.data?.id}
            mutate={mutate}
            handleUpdateDebt={handleUpdateDebt}
          />
        </Container>
      </Page>
    </RoleBasedGuard>
  )
}
