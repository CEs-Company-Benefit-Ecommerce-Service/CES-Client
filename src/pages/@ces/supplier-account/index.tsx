// @mui
import { Button, Container } from '@mui/material'
import { useState } from 'react'
import { Params } from 'src/@types/@ces'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import { useAccountListByRoleId } from 'src/hooks/@ces'
import useSettings from 'src/hooks/useSettings'
import Layout from 'src/layouts'
import AccountTable from 'src/sections/@ces/account/AccountTable'
import NextLink from 'next/link'
import { PATH_CES } from 'src/routes/paths'
import Iconify from 'src/components/Iconify'
// ----------------------------------------------------------------------

AccountPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function AccountPage() {
  const { themeStretch } = useSettings()
  const [params, setParams] = useState<Partial<Params>>()

  const { data, isLoading } = useAccountListByRoleId({ roleId: '2', params })

  return (
    <Page title="Account: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Account List"
          links={[{ name: 'Dashboard', href: '' }, { name: 'Account', href: '' }, { name: 'List' }]}
          action={
            <NextLink href={PATH_CES.account.new('supplier')} passHref>
              <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New Account
              </Button>
            </NextLink>
          }
        />
        <AccountTable data={data} isLoading={isLoading} setParams={setParams} roleId="2" />
      </Container>
    </Page>
  )
}

// ----------------------------------------------------------------------
