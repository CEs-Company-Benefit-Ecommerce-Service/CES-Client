import { Container } from '@mui/material'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { CategoryPayload, Role } from 'src/@types/@ces'
import { categoryApi } from 'src/api-client/category'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import RoleBasedGuard from 'src/guards/RoleBasedGuard'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import CategoryNewEditForm from 'src/sections/@ces/category/CategoryNewEditForm'
// ----------------------------------------------------------------------

AccountCreatePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function AccountCreatePage() {
  const { enqueueSnackbar } = useSnackbar()
  const { push } = useRouter()
  const handleCreateCategorySubmit = async (payload: CategoryPayload) => {
    try {
      await categoryApi.create(payload).then()
      // await create(payload)
      enqueueSnackbar('Create success!')
      push(PATH_CES.category.root)
    } catch (error) {
      enqueueSnackbar('Create failed!', { variant: 'error' })
      console.error(error)
    }
  }
  return (
    <RoleBasedGuard hasContent roles={[Role['Supplier Admin'], Role['System Admin']]}>
      <Page title="Category: Create a new Category">
        <Container>
          <HeaderBreadcrumbs
            heading="Create a new Category"
            links={[
              { name: 'Dashboard', href: '' },
              { name: 'Category', href: '' },
              { name: 'New Category' },
            ]}
          />
          <CategoryNewEditForm onSubmit={handleCreateCategorySubmit} />
        </Container>
      </Page>
    </RoleBasedGuard>
  )
}
