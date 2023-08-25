// @mui
import { Button, Container, Stack } from '@mui/material'
import NextLink from 'next/link'
import { useRef, useState } from 'react'
import { Params } from 'src/@types/@ces'
import axiosClient from 'src/api-client/axiosClient'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Iconify from 'src/components/Iconify'
import Page from 'src/components/Page'
import { useAccountList } from 'src/hooks/@ces'
import useAuth from 'src/hooks/useAuth'
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

  const { data, isLoading } = useAccountList({ params })

  const { user } = useAuth()
  const ref = useRef<HTMLAnchorElement | null>(null)
  const [url, setFileUrl] = useState<string>()

  return (
    <Page title="Account: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Account List"
          links={[{ name: 'Dashboard', href: '' }, { name: 'Account', href: '' }, { name: 'List' }]}
          action={
            <Stack direction={'row'} spacing={2}>
              <a
                style={{ display: 'none' }}
                href={url}
                ref={ref}
                download={`${user?.company.name} employee`}
              />
              <Button
                variant="outlined"
                onClick={async () => {
                  const response: Blob = await axiosClient.get('/excel/account/download', {
                    responseType: 'blob',
                  })

                  const url = window.URL.createObjectURL(response as Blob)

                  setFileUrl(url)
                  ref.current?.click()
                  URL.revokeObjectURL(url)
                }}
              >
                Export excel
              </Button>

              <NextLink href={PATH_CES.account.new('enterprise')} passHref>
                <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                  New Account
                </Button>
              </NextLink>
            </Stack>
          }
        />
        <AccountTable data={data} isLoading={isLoading} setParams={setParams} roleId="3" />
      </Container>
    </Page>
  )
}

// ----------------------------------------------------------------------
