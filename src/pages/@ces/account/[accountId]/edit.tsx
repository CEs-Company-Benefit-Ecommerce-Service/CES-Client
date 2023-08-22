import { Container } from '@mui/material'
import { capitalCase } from 'change-case'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { AccountPayload } from 'src/@types/@ces'
import { accountApi } from 'src/api-client'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import { useAccountDetails } from 'src/hooks/@ces'
import useSettings from 'src/hooks/useSettings'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import AccountNewEditForm from 'src/sections/@ces/account/AccountNewEditForm'

// ----------------------------------------------------------------------

AccountEditPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function AccountEditPage() {
  const { themeStretch } = useSettings()

  const { enqueueSnackbar } = useSnackbar()

  const { query, push } = useRouter()
  const { accountId } = query

  const { data, mutate } = useAccountDetails({ id: `${accountId}` })

  const handleEditAccountSubmit = async (payload: AccountPayload) => {
    try {
      await accountApi.update(`${accountId}`, payload)
      mutate()
      enqueueSnackbar('Update success!')
      push(PATH_CES.account.root)
    } catch (error) {
      enqueueSnackbar('Update failed!', { variant: 'error' })
      console.error(error)
    }
  }

  return (
    <Page title="Account: Edit account">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Edit account"
          links={[
            { name: 'Dashboard', href: '' },
            { name: 'Account', href: '' },
            { name: capitalCase(accountId as string) },
          ]}
        />

        {!data ? (
          <>Loading...</>
        ) : (
          <AccountNewEditForm isEdit currentUser={data?.data} onSubmit={handleEditAccountSubmit} />
        )}
      </Container>
    </Page>
  )
}
