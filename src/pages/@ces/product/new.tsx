import { LoadingButton } from '@mui/lab'
import { Button, Container, Stack, Typography } from '@mui/material'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { ChangeEvent, useRef, useState } from 'react'
import { ProductPayload, Role } from 'src/@types/@ces'
import axiosClient from 'src/api-client/axiosClient'
import { productApi } from 'src/api-client/product'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import RoleBasedGuard from 'src/guards/RoleBasedGuard'
import { useProduct } from 'src/hooks/@ces'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import ProductNewEditForm from 'src/sections/@ces/product/ProductNewEditForm'
// ----------------------------------------------------------------------

ProductCreatePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function ProductCreatePage() {
  const { enqueueSnackbar } = useSnackbar()
  const { push } = useRouter()
  const [file, setFile] = useState<File>()
  const [loading, setLoading] = useState(false)
  const { mutate: mutateList } = useProduct({})
  const handleCreateProductSubmit = async (payload: ProductPayload) => {
    try {
      await productApi.create(payload)
      // await create(payload)
      enqueueSnackbar('Create success!')
      mutateList()
      push(PATH_CES.product.root)
    } catch (error) {
      enqueueSnackbar('Create failed!', { variant: 'error' })
      console.error(error)
    }
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      return
    }
    const file = e.target.files[0]

    setFile(file)
  }
  const inputRef = useRef<HTMLInputElement>(null)
  const resetFileInput = () => {
    if (inputRef.current) inputRef.current.value = ''
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
      push(PATH_CES.product.root)
    } catch (error) {
      enqueueSnackbar('Import failed!', { variant: 'error' })
      console.error(error)
    }
  }

  return (
    <RoleBasedGuard hasContent roles={[Role['Supplier Admin']]}>
      <Page title="Product: Create a new Product">
        <Container>
          <HeaderBreadcrumbs
            heading="Create a new Product"
            links={[
              { name: 'Dashboard', href: '' },
              { name: 'Product', href: '' },
              { name: 'New Product' },
            ]}
            action={
              <Button
                variant="outlined"
                onClick={() =>
                  (window.location.href = 'https://api-dev.ces.bio/api/excel/product/template')
                }
              >
                Download excel template
              </Button>
            }
          />
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
          <ProductNewEditForm onSubmit={handleCreateProductSubmit} />
        </Container>
      </Page>
    </RoleBasedGuard>
  )
}
