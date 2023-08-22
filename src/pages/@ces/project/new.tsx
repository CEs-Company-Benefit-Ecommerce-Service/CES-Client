import { Container } from '@mui/material'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { ProjectPayload, Role } from 'src/@types/@ces'
import { projectApi } from 'src/api-client'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import RoleBasedGuard from 'src/guards/RoleBasedGuard'
import useSettings from 'src/hooks/useSettings'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import ProjectNewEditForm from 'src/sections/@ces/project/ProjectNewEditForm'

// ----------------------------------------------------------------------

ProjectCreatePage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function ProjectCreatePage() {
  const { themeStretch } = useSettings()

  const { enqueueSnackbar } = useSnackbar()

  const { push } = useRouter()

  const handleCreateProjectSubmit = async (payload: ProjectPayload) => {
    try {
      await projectApi.create(payload)

      enqueueSnackbar('Create success!')
      push(PATH_CES.project.root)
    } catch (error) {
      enqueueSnackbar('Create failed!', { variant: 'error' })
      console.error(error)
    }
  }

  return (
    <RoleBasedGuard hasContent roles={[Role['Enterprise Admin']]}>
      <Page title="Project: Create a new project">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Create a new project"
            links={[
              { name: 'Dashboard', href: '' },
              { name: 'Project', href: '' },
              { name: 'New Project' },
            ]}
          />

          <ProjectNewEditForm onSubmit={handleCreateProjectSubmit} />
        </Container>
      </Page>
    </RoleBasedGuard>
  )
}
