import { capitalCase } from 'change-case'
// @mui
import { Box, Container, Tab, Tabs } from '@mui/material'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { CompanyPayload } from 'src/@types/@ces'
import { companyApi } from 'src/api-client'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Iconify from 'src/components/Iconify'
import Page from 'src/components/Page'
import { useCompanyDetails } from 'src/hooks/@ces'
import useSettings from 'src/hooks/useSettings'
import useTabs from 'src/hooks/useTabs'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import AccountWallet from 'src/sections/@ces/account/wallet/AccountWallet'
import CompanyEmployeeTable from 'src/sections/@ces/company/CompanyEmployeeTable'
import CompanyNewEditForm from 'src/sections/@ces/company/CompanyNewEditForm'
import CompanyOrderTable from 'src/sections/@ces/company/order/CompanyOrderTable'
import CompanyTransactionTable from 'src/sections/@ces/company/transaction/CompanyTransactionTable'
import CompanyGeneral from 'src/sections/@ces/company/general/CompanyGeneral'

// ----------------------------------------------------------------------

CompanyDetails.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function CompanyDetails() {
  const { themeStretch } = useSettings()

  const { currentTab, onChangeTab } = useTabs('general')

  const { query } = useRouter()
  const { companyId } = query

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <CompanyGeneral companyId={`${companyId}`} />,
    },
    {
      value: 'employee account',
      // icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <CompanyEmployeeTable companyId={`${companyId}`} />,
    },
    {
      value: 'order',
      // icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <CompanyOrderTable companyId={`${companyId}`} />,
    },
    {
      value: 'transaction',
      icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
      component: <CompanyTransactionTable companyId={`${companyId}`} />,
    },
    // {
    //   value: 'wallet',
    //   // icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
    //   component: (
    //     <AccountWallet
    //       companyId={`${companyId}`}
    //       accountId={data?.data?.contactPersonId}
    //       // currentUser={accountDetails?.data}
    //       mutate={mutate}
    //     />
    //   ),
    // },
  ]

  return (
    <Page title="Company Settings">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Company"
          links={[
            { name: 'Dashboard', href: PATH_CES.root },
            { name: 'Company', href: PATH_CES.account.root },
            { name: 'Company Details' },
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

        {false ? (
          <>Loading...</>
        ) : (
          ACCOUNT_TABS.map((tab) => {
            const isMatched = tab.value === currentTab
            return isMatched && <Box key={tab.value}>{tab.component}</Box>
          })
        )}
      </Container>
    </Page>
  )
}
