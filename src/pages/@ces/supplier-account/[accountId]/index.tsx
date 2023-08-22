// @mui
import { Box, Container, Tab, Tabs } from '@mui/material'
import { capitalCase } from 'change-case'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { AccountPayload, Role } from 'src/@types/@ces'
import { accountApi } from 'src/api-client'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Iconify from 'src/components/Iconify'
import Page from 'src/components/Page'
import { useAccountDetails } from 'src/hooks/@ces'
import useAuth from 'src/hooks/useAuth'
import useSettings from 'src/hooks/useSettings'
import useTabs from 'src/hooks/useTabs'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import AccountNewEditForm from 'src/sections/@ces/account/AccountNewEditForm'
import CategoryTableCustom from 'src/sections/@ces/account/CategoryTableCustom'
import OrderTableCustom from 'src/sections/@ces/account/OrdertableCustom'
import ProductTableCustom from 'src/sections/@ces/account/ProductTableCustom'
import AccountWallet from 'src/sections/@ces/account/wallet/AccountWallet'

// ----------------------------------------------------------------------

UserAccount.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function UserAccount() {
  const { themeStretch } = useSettings()

  const { currentTab, onChangeTab } = useTabs('general')

  const { enqueueSnackbar } = useSnackbar()

  const { user } = useAuth()
  const { query, push } = useRouter()
  const { accountId } = query

  const { data, mutate } = useAccountDetails({ id: `${accountId}` })

  const companyId = user?.companyId
  const supId = data?.data?.suppliers?.map((m) => m.id)[0]
  const handleEditAccountSubmit = async (payload: AccountPayload) => {
    try {
      await accountApi.update(`${accountId}`, payload)
      mutate()
      push(PATH_CES.account.detail(`${accountId}`))
      enqueueSnackbar('Update success!')
    } catch (error) {
      enqueueSnackbar('Update failed!', { variant: 'error' })
      console.error(error)
    }
  }

  const ACCOUNT_TABS =
    user?.role == Role['Enterprise Admin']
      ? [
          {
            value: 'general',
            icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
            component: (
              <AccountNewEditForm
                isEdit
                currentUser={data?.data}
                onSubmit={handleEditAccountSubmit}
              />
            ),
          },
          {
            value: 'wallet',
            icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
            component: (
              <AccountWallet
                accountId={`${accountId}`}
                companyId={`${companyId}`}
                mutate={mutate}
              />
            ),
          },
        ]
      : [
          {
            value: 'general',
            icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
            component: (
              <AccountNewEditForm
                isEdit
                currentUser={data?.data}
                onSubmit={handleEditAccountSubmit}
              />
            ),
          },
        ]

  if (data?.data?.role == 2) {
    ACCOUNT_TABS.push(
      {
        value: 'product',
        icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
        component: <ProductTableCustom supplierId={supId} />,
      },
      {
        value: 'category',
        icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
        component: <CategoryTableCustom supplierId={supId} />,
      },
      {
        value: 'order',
        icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
        component: <OrderTableCustom supplierId={supId} />,
      }
    )
  }

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
