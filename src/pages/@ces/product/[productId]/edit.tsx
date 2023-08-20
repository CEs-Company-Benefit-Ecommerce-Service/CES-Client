// ----------------------------------------------------------------------

import { Box, Container, Tab, Tabs } from '@mui/material'
import { capitalCase } from 'change-case'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { Role } from 'src/@types/@ces'
import { ProductPayload } from 'src/@types/@ces/product'
import { productApi } from 'src/api-client/product'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Iconify from 'src/components/Iconify'
import Page from 'src/components/Page'
import RoleBasedGuard from 'src/guards/RoleBasedGuard'
import { useProductDetail } from 'src/hooks/@ces/useProduct'
import useTabs from 'src/hooks/useTabs'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import DiscountTab from 'src/sections/@ces/product/DiscountTab'
import ProductNewEditForm from 'src/sections/@ces/product/ProductNewEditForm'

ProductEditPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function ProductEditPage() {
  const { query } = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const { productId } = query
  const { currentTab, onChangeTab } = useTabs('general')
  const { push } = useRouter()
  const { data, mutate } = useProductDetail({ id: `${productId}` })

  const handleEditProductSubmit = async (payload: ProductPayload) => {
    try {
      await productApi.update(`${productId}`, payload)
      enqueueSnackbar('Update success!')
      push(PATH_CES.product.root)
      mutate()
    } catch (error) {
      enqueueSnackbar('Update failed!', { variant: 'error' })
    }
  }

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: (
        <ProductNewEditForm isEdit currentUser={data?.data} onSubmit={handleEditProductSubmit} />
      ),
    },
    {
      value: 'discount',
      icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
      component: (
        <DiscountTab
          mutateProductDetails={mutate}
          productId={`${productId}`}
          currentUser={data?.data}
        />
      ),
    },
  ]

  return (
    <RoleBasedGuard hasContent roles={[Role['Supplier Admin']]}>
      <Page title="Product: Edit Product">
        <Container>
          <HeaderBreadcrumbs
            heading="Edit Product"
            links={[
              { name: 'Dashboard', href: '' },
              { name: 'Product', href: '' },
              { name: data?.data?.name },
            ]}
          />

          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={currentTab}
            onChange={onChangeTab}
          >
            {ACCOUNT_TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                label={capitalCase(tab.value)}
                icon={tab.icon}
                value={tab.value}
              />
            ))}
          </Tabs>

          <Box sx={{ mb: 5 }} />

          {!data ? (
            <>Loading...</>
          ) : (
            ACCOUNT_TABS.map((tab) => {
              const isMatched = tab.value === currentTab
              return isMatched && <Box key={tab.value}>{tab.component}</Box>
            })
          )}

          {/* {data && (
            <ProductNewEditForm
              isEdit
              currentUser={data?.data}
              onSubmit={handleEditProductSubmit}
            />
          )} */}
        </Container>
      </Page>
    </RoleBasedGuard>
  )
}
