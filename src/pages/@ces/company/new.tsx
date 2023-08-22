import { Container } from '@mui/material'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { CompanyPayload, Role } from 'src/@types/@ces'
import { companyApi } from 'src/api-client'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import RoleBasedGuard from 'src/guards/RoleBasedGuard'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import CompanyNewEditForm from 'src/sections/@ces/company/CompanyNewEditForm'
// ----------------------------------------------------------------------

CompanyCreatePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function CompanyCreatePage() {
  const { enqueueSnackbar } = useSnackbar()
  const { push } = useRouter()
  const handleCreateCompanySubmit = async (payload: CompanyPayload) => {
    try {
      await companyApi.create(payload)
      enqueueSnackbar('Create success!')
      push(PATH_CES.company.root)
    } catch (error) {
      enqueueSnackbar('Create failed!', { variant: 'error' })
      console.error(error)
    }
  }

  return (
    <RoleBasedGuard hasContent roles={[Role['System Admin']]}>
      <Page title="Company: Create a new Company">
        <Container>
          <HeaderBreadcrumbs
            heading="Create a new Company"
            links={[
              { name: 'Dashboard', href: '' },
              { name: 'Company', href: '' },
              { name: 'New Company' },
            ]}
          />

          <CompanyNewEditForm onSubmit={handleCreateCompanySubmit} />
        </Container>
      </Page>
    </RoleBasedGuard>
  )
}
