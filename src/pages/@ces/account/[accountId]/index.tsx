import { capitalCase } from 'change-case'
// @mui
import { Box, Container, Tab, Tabs } from '@mui/material'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { AccountPayload } from 'src/@types/@ces'
import { _userInvoices } from 'src/_mock'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Iconify from 'src/components/Iconify'
import Page from 'src/components/Page'
import { useAccountDetails } from 'src/hooks/@ces'
import useSettings from 'src/hooks/useSettings'
import useTabs from 'src/hooks/useTabs'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import AccountNewEditForm from 'src/sections/@ces/account/AccountNewEditForm'
import AccountWallet from 'src/sections/@ces/account/wallet/AccountWallet'
import { accountApi } from 'src/api-client'

// ----------------------------------------------------------------------

UserAccount.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function UserAccount() {
  const { themeStretch } = useSettings()

  const { currentTab, onChangeTab } = useTabs('general')

  const { enqueueSnackbar } = useSnackbar()

  const { query, push } = useRouter()
  const { accountId } = query

  const { data, mutate } = useAccountDetails({ id: `${accountId}` })

  const handleEditAccountSubmit = async (payload: AccountPayload) => {
    try {
      await accountApi.update(`${accountId}`, payload)

      push(PATH_CES.account.root)
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
      component: (
        <AccountNewEditForm isEdit currentUser={data?.data} onSubmit={handleEditAccountSubmit} />
      ),
    },
    {
      value: 'wallet',
      icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
      component: (
        <AccountWallet wallets={data?.data?.wallets} invoices={_userInvoices} mutate={mutate} />
      ),
    },
  ]

  return (
    <Page title="User: Account Settings">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Account"
          links={[
            { name: 'Dashboard', href: PATH_CES.root },
            { name: 'Account', href: PATH_CES.account.root },
            { name: 'Account Details' },
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
      </Container>
    </Page>
  )
}
