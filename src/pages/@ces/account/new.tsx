import { LoadingButton } from '@mui/lab'
import { Button, Container, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { ChangeEvent, useRef, useState } from 'react'
import { AccountPayload, Role } from 'src/@types/@ces'
import { accountApi } from 'src/api-client'
import axiosClient from 'src/api-client/axiosClient'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import useAuth from 'src/hooks/useAuth'
import useSettings from 'src/hooks/useSettings'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import AccountNewEditForm from 'src/sections/@ces/account/AccountNewEditForm'

// ----------------------------------------------------------------------

AccountCreatePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function AccountCreatePage() {
  const { themeStretch } = useSettings()

  const { enqueueSnackbar } = useSnackbar()

  const { push } = useRouter()

  const handleCreateAccountSubmit = async (payload: AccountPayload) => {
    try {
      await accountApi.create(payload)

      enqueueSnackbar('Create success!')
      push(PATH_CES.account.root)
    } catch (error) {
      enqueueSnackbar('Create failed!', {})
      console.error(error)
    }
  }
  const inputRef = useRef<HTMLInputElement>(null)

  const resetFileInput = () => {
    // resetting the input value
    if (inputRef.current) inputRef.current.value = ''
  }

  const { user } = useAuth()

  const [file, setFile] = useState<File>()
  const [loading, setLoading] = useState(false)

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }
    const file = e.target.files[0]

    setFile(file)
  }

  const handleSubmitUploadExcel = async () => {
    try {
      setLoading(true)
      const formData = new FormData()

      formData.append('file', file!)
      await axiosClient.post('/excel/product/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setLoading(false)

      enqueueSnackbar('Import success!')

      resetFileInput()
      setFile(undefined)
      push(PATH_CES.account.root)
    } catch (error) {
      console.error(error)
      enqueueSnackbar('Import failed!')
    }
  }

  return (
    <Page title="Account: Create a new Account">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Create a new Account"
          links={[
            { name: 'Dashboard', href: PATH_CES.root },
            { name: 'Account', href: PATH_CES.account.root },
            { name: 'New Account' },
          ]}
          action={
            user?.role === Role['Enterprise Admin'] && (
              <Button
                variant="outlined"
                onClick={() =>
                  (window.location.href = 'https://api-dev.ces.bio/api/excel/account/template')
                }
              >
                Download excel template
              </Button>
            )
          }
        />

        {user?.role === Role['Enterprise Admin'] && (
          <Stack direction={'row'} spacing={1} mb={4}>
            <LoadingButton
              loading={loading}
              variant="contained"
              onClick={handleSubmitUploadExcel}
              disabled={!file}
            >
              Submit
            </LoadingButton>
            <Stack direction={'row'} alignItems={'center'} spacing={1}>
              <Button variant="outlined" component="label">
                Import File
                <input type="file" hidden onChange={handleFileUpload} ref={inputRef} />
              </Button>
              <Typography>{file?.name}</Typography>
            </Stack>
          </Stack>
        )}
        <AccountNewEditForm onSubmit={handleCreateAccountSubmit} />
      </Container>
    </Page>
  )
}
