// @mui
import { Box, Container, Tab, Tabs } from '@mui/material'
import { capitalCase } from 'change-case'
import { Role } from 'src/@types/@ces'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Iconify from 'src/components/Iconify'
import Page from 'src/components/Page'
import SvgIconStyle from 'src/components/SvgIconStyle'
import RoleBasedGuard from 'src/guards/RoleBasedGuard'
import useAuth from 'src/hooks/useAuth'
import useTabs from 'src/hooks/useTabs'
import Layout from 'src/layouts'
import CompanyOrderTable from 'src/sections/@ces/company/order/CompanyOrderTable'
import MonthlyOrderTableCustom from 'src/sections/@ces/order/MonthlyOrdertableCustom'
import OrderTableSupplier from 'src/sections/@ces/order/OrderTableSupplier'

// ----------------------------------------------------------------------

OrderPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default function OrderPage() {
  const { user } = useAuth()
  const compId = user?.companyId?.toString()
  const { currentTab, onChangeTab } = useTabs('monthly orders')
  const role = user?.role
  const ORDER_TABS = [
    {
      value: 'monthly orders',
      icon: <SvgIconStyle src="/assets/icons/navbar/Calendar.svg" width={20} height={20} />,

      component: <MonthlyOrderTableCustom />,
    },
    {
      value: 'total orders',
      icon: <SvgIconStyle src="/assets/icons/navbar/Update-Time.svg" width={20} height={20} />,
      component: <CompanyOrderTable companyId={`${compId}`} />,
    },
  ]

  return (
    <RoleBasedGuard hasContent roles={[Role['Supplier Admin'], Role['Enterprise Admin']]}>
      <Page title="Order: List">
        <Container>
          <HeaderBreadcrumbs
            heading="Order List"
            links={[{ name: 'Dashboard', href: '' }, { name: 'Order', href: '' }, { name: 'List' }]}
          />
          {role == 2 ? (
            <OrderTableSupplier />
          ) : (
            <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={currentTab}
              onChange={onChangeTab}
            >
              {ORDER_TABS.map((tab) => (
                <Tab
                  disableRipple
                  key={tab.value}
                  label={capitalCase(tab.value)}
                  icon={tab.icon}
                  value={tab.value}
                />
              ))}
            </Tabs>
          )}

          <Box sx={{ mb: 5 }} />

          {false ? (
            <>Loading...</>
          ) : role == 2 ? null : (
            ORDER_TABS.map((tab) => {
              const isMatched = tab.value === currentTab
              return isMatched && <Box key={tab.value}>{tab.component}</Box>
            })
          )}
        </Container>
      </Page>
    </RoleBasedGuard>
  )
}

// ----------------------------------------------------------------------
