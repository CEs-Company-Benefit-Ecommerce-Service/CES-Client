import { capitalCase } from 'change-case'
// @mui
import { Box, Button, Container, Tab, Tabs } from '@mui/material'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { ProjectPayload, Role } from 'src/@types/@ces'
import { projectApi } from 'src/api-client'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Iconify from 'src/components/Iconify'
import Page from 'src/components/Page'
import RoleBasedGuard from 'src/guards/RoleBasedGuard'
import { useProjectDetails } from 'src/hooks/@ces'
import useSettings from 'src/hooks/useSettings'
import useTabs from 'src/hooks/useTabs'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import ProjectNewEditForm from 'src/sections/@ces/project/ProjectNewEditForm'
import ProjectMember from 'src/sections/@ces/project/members/ProjectMember'

// ----------------------------------------------------------------------

ProjectDetails.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function ProjectDetails() {
  const { themeStretch } = useSettings()

  const { currentTab, onChangeTab } = useTabs('general')

  const { enqueueSnackbar } = useSnackbar()

  const { query } = useRouter()
  const { projectId } = query

  const { data } = useProjectDetails({ id: `${projectId}` })

  const handleEditProjectSubmit = async (payload: ProjectPayload) => {
    try {
      await projectApi.update(`${projectId}`, payload)

      enqueueSnackbar('Update success!')
    } catch (error) {
      enqueueSnackbar('Update failed!')
      console.error(error)
    }
  }

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: (
        <ProjectNewEditForm isEdit currentUser={data?.data} onSubmit={handleEditProjectSubmit} />
      ),
    },
    {
      value: 'members',
      icon: <Iconify icon={'fa6-solid:people-line'} width={20} height={20} />,
      component: <ProjectMember />,
    },
  ]

  return (
    <RoleBasedGuard hasContent roles={[Role['Enterprise Admin']]}>
      <Page title="Project: Project Settings">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Project"
            links={[
              { name: 'Dashboard', href: PATH_CES.root },
              { name: 'Project', href: PATH_CES.project.root },
              { name: 'Project Details' },
            ]}
            action={
              <Button
                onClick={() => {
                  projectApi.transferMoney(`${projectId}`)
                }}
                variant="contained"
                // startIcon={<Iconify icon={'eva:plus-fill'} />}
              >
                Transfer Benefit
              </Button>
            }
          />

          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={currentTab}
            onChange={onChangeTab}
          >
            {ACCOUNT_TABS.map((tab) => (
              <Tab
                disableRipple
                key={tab.value}
                label={capitalCase(tab.value)}
                icon={tab.icon}
                value={tab.value}
              />
            ))}
          </Tabs>

          <Box sx={{ mb: 5 }} />

          {!data ? (
            <>Loading...</>
          ) : (
            ACCOUNT_TABS.map((tab) => {
              const isMatched = tab.value === currentTab
              return isMatched && <Box key={tab.value}>{tab.component}</Box>
            })
          )}
        </Container>
      </Page>
    </RoleBasedGuard>
  )
}
