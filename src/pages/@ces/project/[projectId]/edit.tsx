import { Container } from '@mui/material'
import { capitalCase } from 'change-case'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { ProjectPayload, Role } from 'src/@types/@ces'
import { projectApi } from 'src/api-client'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import RoleBasedGuard from 'src/guards/RoleBasedGuard'
import { useProjectDetails } from 'src/hooks/@ces'
import useSettings from 'src/hooks/useSettings'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import ProjectNewEditForm from 'src/sections/@ces/project/ProjectNewEditForm'

ProjectEditPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function ProjectEditPage() {
  const { themeStretch } = useSettings()

  const { enqueueSnackbar } = useSnackbar()

  const { query, push } = useRouter()
  const { projectId } = query

  const { data } = useProjectDetails({ id: `${projectId}` })

  const handleEditProjectSubmit = async (payload: ProjectPayload) => {
    try {
      await projectApi.update(`${projectId}`, payload)

      enqueueSnackbar('Update success!')
      push(PATH_CES.project.root)
    } catch (error) {
      enqueueSnackbar('Update failed!', { variant: 'error' })
      console.error(error)
    }
  }

  return (
    <RoleBasedGuard hasContent roles={[Role['Enterprise Admin']]}>
      <Page title="Project: Edit project">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Edit project"
            links={[
              { name: 'Dashboard', href: '' },
              { name: 'Project', href: '' },
              { name: capitalCase(projectId as string) },
            ]}
          />

          <ProjectNewEditForm isEdit currentUser={data?.data} onSubmit={handleEditProjectSubmit} />
        </Container>
      </Page>
    </RoleBasedGuard>
  )
}
