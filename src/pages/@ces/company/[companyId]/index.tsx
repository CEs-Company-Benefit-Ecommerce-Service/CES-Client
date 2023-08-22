// @mui
import { Box, Container, Tab, Tabs } from '@mui/material'
import { capitalCase } from 'change-case'
import { useRouter } from 'next/router'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import SvgIconStyle from 'src/components/SvgIconStyle'
import { useCompanyDetails } from 'src/hooks/@ces'
import useSettings from 'src/hooks/useSettings'
import useTabs from 'src/hooks/useTabs'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import CompanyEmployeeTable from 'src/sections/@ces/company/CompanyEmployeeTable'
import CompanyGeneral from 'src/sections/@ces/company/general/CompanyGeneral'
import CompanyOrderTable from 'src/sections/@ces/company/order/CompanyOrderTable'
import CompanyTransactionTable from 'src/sections/@ces/company/transaction/CompanyTransactionTable'

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
  const { data } = useCompanyDetails({ id: `${companyId}` })

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <SvgIconStyle src="/assets/icons/navbar/Application-User.svg" width={20} height={20} />,
      component: <CompanyGeneral companyId={`${companyId}`} />,
    },
    {
      value: 'employee account',
      icon: <SvgIconStyle src="/assets/icons/navbar/Connecting-Users.svg" width={20} height={20} />,
      component: <CompanyEmployeeTable companyId={`${companyId}`} />,
    },
    {
      value: 'order',
      icon: <SvgIconStyle src="/assets/icons/navbar/Tasks-1.svg" width={20} height={20} />,
      component: <CompanyOrderTable companyId={`${companyId}`} />,
    },
    {
      value: 'transaction',
      icon: <SvgIconStyle src="/assets/icons/navbar/Convert-Curency.svg" width={20} height={20} />,
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
            { name: 'Company List', href: PATH_CES.company.root },
            { name: `${data?.data?.name || capitalCase(companyId as string)}` },
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
