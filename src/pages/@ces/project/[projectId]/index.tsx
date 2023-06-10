import { capitalCase } from 'change-case'
// @mui
import { Box, Container, Tab, Tabs } from '@mui/material'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { ProjectPayload } from 'src/@types/@ces'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Iconify from 'src/components/Iconify'
import Page from 'src/components/Page'
import useSettings from 'src/hooks/useSettings'
import useTabs from 'src/hooks/useTabs'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import ProjectMember from 'src/sections/@ces/project/members/ProjectMember'
import ProjectNewEditForm from 'src/sections/@ces/project/ProjectNewEditForm'
import { useProjectDetails } from 'src/hooks/@ces'
import { projectApi } from 'src/api-client'

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

  // const { update } = useProject({ id: '1' })

  const { data } = useProjectDetails({ id: `${projectId}` })

  const handleEditProjectSubmit = async (payload: ProjectPayload) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      await projectApi.update(data?.data?.id!, payload)
      // await update(data?.data?.id, payload)
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
      component: data && (
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
    <Page title="Project: Project Settings">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Project"
          links={[
            { name: 'Dashboard', href: PATH_CES.root },
            { name: 'Project', href: PATH_CES.project.root },
            { name: 'Project Details' },
          ]}
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

        {ACCOUNT_TABS.map((tab) => {
          const isMatched = tab.value === currentTab
          return isMatched && <Box key={tab.value}>{tab.component}</Box>
        })}
      </Container>
    </Page>
  )
}
