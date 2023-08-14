// @mui
import { Button, Container } from '@mui/material'
import NextLink from 'next/link'
import { useState } from 'react'
import { Params } from 'src/@types/@ces'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Iconify from 'src/components/Iconify'
import Page from 'src/components/Page'
import { useAccountListShipperId } from 'src/hooks/@ces'
import useSettings from 'src/hooks/useSettings'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import AccountTable from 'src/sections/@ces/account/AccountTable'

// ----------------------------------------------------------------------

AccountPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function AccountPage() {
  const { themeStretch } = useSettings()
  const [params, setParams] = useState<Partial<Params>>()
  const { data, isLoading } = useAccountListShipperId({ roleId: '5', params })

  return (
    <Page title="Account: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Account List"
          links={[{ name: 'Dashboard', href: '' }, { name: 'Account', href: '' }, { name: 'List' }]}
          action={
            <NextLink href={PATH_CES.account.new("shipper")} passHref>
              <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New Account
              </Button>
            </NextLink>
          }
        />
        <AccountTable data={data} isLoading={isLoading} setParams={setParams} roleId='5'/>
      </Container>
    </Page>
  )
}

// ----------------------------------------------------------------------
