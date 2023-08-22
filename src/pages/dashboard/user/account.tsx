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
// components
import HeaderBreadcrumbs from '../../../components/HeaderBreadcrumbs'
import Page from '../../../components/Page'
// hooks
import useSettings from '../../../hooks/useSettings'
import useTabs from '../../../hooks/useTabs'
// layouts
import Layout from '../../../layouts'
// routes
import SvgIconStyle from 'src/components/SvgIconStyle'
import { _userAddressBook, _userInvoices, _userPayment } from '../../../_mock'
import { PATH_DASHBOARD } from '../../../routes/paths'
import { AccountBilling } from '../../../sections/@dashboard/user/account'

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
      enqueueSnackbar('Update success!')
    } catch (error) {
      enqueueSnackbar('Update failed!', { variant: 'error' })
      console.error(error)
    }
  }

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <SvgIconStyle src="/assets/icons/navbar/Application-User.svg" width={20} height={20} />,
      component: <AccountNewEditForm isEdit currentUser={data} />,
    },
  ]
  if (data?.role == 3) {
    ACCOUNT_TABS.push({
      value: 'billing',
      icon: <SvgIconStyle src="/assets/icons/navbar/Sign-Contract.svg" width={20} height={20} />,
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
      icon: <SvgIconStyle src="/assets/icons/navbar/LockOpen.svg" width={20} height={20} />,
      component: <AccountChangePasswordForm onSubmit={handleChangePasswordSubmit} />,
    })
  } else {
    ACCOUNT_TABS.push({
      value: 'change password',
      icon: <SvgIconStyle src="/assets/icons/navbar/LockOpen.svg" width={20} height={20} />,
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
