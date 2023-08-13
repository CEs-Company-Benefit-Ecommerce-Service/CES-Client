// @mui
import { Box, Container, Tab, Tabs } from '@mui/material'
import { capitalCase } from 'change-case'
// sections
import { useSnackbar } from 'notistack'
import { ChangePasswordPayload } from 'src/@types/@ces'
import { accountApi } from 'src/api-client'
import { useMe } from 'src/hooks/@ces'
import AccountChangePasswordForm from 'src/sections/@ces/account/AccountChangePasswordForm'
// _mock_
import AccountNewEditForm from 'src/sections/@ces/account/AccountNewEditForm'
import EaOrderTableCustom from 'src/sections/@ces/account/EaOrderTableCustom'
import TransactionTableCustom from 'src/sections/@ces/account/TransactionTableCustom'
// components
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs'
import Iconify from '../../../components/Iconify'
import Page from '../../../components/Page'
// hooks
import useSettings from '../../../hooks/useSettings'
import useTabs from '../../../hooks/useTabs'
// layouts
import Layout from '../../../layouts'
// routes
import { PATH_DASHBOARD } from '../../../routes/paths'
import { AccountBilling } from '../../../sections/@dashboard/user/account'
import { _userAddressBook, _userInvoices, _userPayment } from '../../../_mock'

// ----------------------------------------------------------------------

UserAccount.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function UserAccount() {
  const { themeStretch } = useSettings()
  const { enqueueSnackbar } = useSnackbar()

  const { currentTab, onChangeTab } = useTabs('general')
  const { data } = useMe({})
  const handleChangePasswordSubmit = async (payload: ChangePasswordPayload) => {
    try {
      await accountApi.updatePassword(payload)
      // push(PATH_CES.account.detail(`${accountId}`))
      enqueueSnackbar('Update success!')
    } catch (error) {
      enqueueSnackbar('Update failed!')
      console.error(error)
    }
  }

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <AccountNewEditForm isEdit currentUser={data} />,
    },
  ]
  if (data?.role == 3) {
    ACCOUNT_TABS.push({
      value: 'billing',
      icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
      component: (
        <AccountBilling
          cards={_userPayment}
          addressBook={_userAddressBook}
          invoices={_userInvoices}
        />
      ),
    })
    ACCOUNT_TABS.push({
      value: 'change password',
      icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
      component: <AccountChangePasswordForm onSubmit={handleChangePasswordSubmit} />,
    })
    // ACCOUNT_TABS.push({
    //   value: 'Transaction',
    //   icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
    //   component: <TransactionTableCustom />,
    // })
    // ACCOUNT_TABS.push({
    //   value: 'Order',
    //   icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
    //   component: <EaOrderTableCustom />,
    // })
  } else {
    ACCOUNT_TABS.push({
      value: 'change password',
      icon: <Iconify icon={'ic:round-vpn-key'} width={20} height={20} />,
      component: <AccountChangePasswordForm onSubmit={handleChangePasswordSubmit} />,
    })
  }

  return (
    <Page title="User: Account Settings">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Account"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'Account Settings' },
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

        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab
          return isMatched && <Box key={tab.value}>{tab.component}</Box>
        })}
      </Container>
    </Page>
  )
}
