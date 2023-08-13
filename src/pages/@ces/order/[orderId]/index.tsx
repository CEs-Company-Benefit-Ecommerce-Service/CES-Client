// next
// @mui
import { Container } from '@mui/material'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { Role } from 'src/@types/@ces'
import { orderApi } from 'src/api-client/order'
import LoadingScreen from 'src/components/LoadingScreen'
import RoleBasedGuard from 'src/guards/RoleBasedGuard'
// sections
import { useOrderDetail } from 'src/hooks/@ces/useOrder'
import OrderDetails from 'src/sections/@ces/order/details'
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs'
// components
import Page from '../../../../components/Page'
// hooks
import useSettings from '../../../../hooks/useSettings'
// layouts
import Layout from '../../../../layouts'
// routes
import { PATH_CES, PATH_DASHBOARD } from '../../../../routes/paths'

// ----------------------------------------------------------------------

InvoiceDetails.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function InvoiceDetails() {
  const { themeStretch } = useSettings()
  const { enqueueSnackbar } = useSnackbar()
  const { query } = useRouter()
  const { orderId } = query
  const { data, mutate, isLoading } = useOrderDetail({ id: `${orderId}` })
  const handleEditOrderSubmit = async (id: string, status: number) => {
    try {
      await orderApi.update(id, status)
      mutate()
      enqueueSnackbar('Update success!')
    } catch (error) {
      enqueueSnackbar('Update failed!')
      console.error(error)
    }
  }
  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <RoleBasedGuard hasContent roles={[Role['Supplier Admin'], Role['Enterprise Admin']]}>
      <Page title="Order: View">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Order Details"
            links={[
              { name: 'Dashboard', href: PATH_DASHBOARD.root },
              {
                name: 'Order',
                href: PATH_CES.order.root,
              },
              { name: `${orderId}` || '' },
            ]}
          />

          <OrderDetails order={data?.data} handleEditOrderSubmit={handleEditOrderSubmit} />
        </Container>
      </Page>
    </RoleBasedGuard>
  )
}
