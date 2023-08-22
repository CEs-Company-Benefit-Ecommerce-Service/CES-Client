// ----------------------------------------------------------------------

import { Container } from '@mui/material'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { CategoryPayload, Role } from 'src/@types/@ces'
import { categoryApi } from 'src/api-client/category'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import LoadingScreen from 'src/components/LoadingScreen'
import Page from 'src/components/Page'
import RoleBasedGuard from 'src/guards/RoleBasedGuard'
import { useCategoryDetails } from 'src/hooks/@ces/useCategory'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import CategoryNewEditForm from 'src/sections/@ces/category/CategoryNewEditForm'

CategoryEditPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function CategoryEditPage() {
  const { query, push } = useRouter()
  const { enqueueSnackbar } = useSnackbar()
  const { categoryId } = query
  const { data, isLoading } = useCategoryDetails({ id: `${categoryId}` })
  // const name = data?.data?.name.toString().toUpperCase()
  if (isLoading) {
    return <LoadingScreen />
  }
  const handleEditCategorySubmit = async (payload: CategoryPayload) => {
    try {
      await categoryApi.update(`${categoryId}`, payload)
      // await update(data?.data.id, payload)
      enqueueSnackbar('Update success!')
      push(PATH_CES.category.root)
    } catch (error) {
      enqueueSnackbar('Update failed!', { variant: 'error' })
      console.error(error)
    }
  }

  return (
    <RoleBasedGuard hasContent roles={[Role['Supplier Admin'], Role['System Admin']]}>
      <Page title="Category: Edit category">
        <Container>
          <HeaderBreadcrumbs
            heading="Edit category"
            links={[
              { name: 'Dashboard', href: '' },
              { name: 'Category', href: '' },
              { name: data?.data?.name },
            ]}
          />

          <CategoryNewEditForm
            isEdit
            currentUser={data?.data}
            onSubmit={handleEditCategorySubmit}
          />
        </Container>
      </Page>
    </RoleBasedGuard>
  )
}
