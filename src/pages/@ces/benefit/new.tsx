import { Container } from '@mui/material'

import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { BenefitPayload, Role } from 'src/@types/@ces'
import { benefitApi } from 'src/api-client'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Page from 'src/components/Page'
import RoleBasedGuard from 'src/guards/RoleBasedGuard'
import useSettings from 'src/hooks/useSettings'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import BenefitNewEditForm from 'src/sections/@ces/benefit/BenefitNewEditForm'
// ----------------------------------------------------------------------

BenefitCreatePage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <Layout>
      <RoleBasedGuard hasContent roles={[Role['Enterprise Admin']]}>
        {page}
      </RoleBasedGuard>
    </Layout>
  )
}

// ----------------------------------------------------------------------

export default function BenefitCreatePage() {
  const { themeStretch } = useSettings()

  const { enqueueSnackbar } = useSnackbar()

  const { push } = useRouter()

  const handleCreateProjectSubmit = async (payload: BenefitPayload) => {
    try {
      await benefitApi.create(payload)

      enqueueSnackbar('Create success!')
      push(PATH_CES.benefit.root)
    } catch (error) {
      enqueueSnackbar('Create failed!', { variant: 'error' })
      console.error(error)
    }
  }

  return (
    <Page title="Project: Create a new ">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Create a new benefit"
          links={[
            { name: 'Dashboard', href: '' },
            { name: 'Benefit', href: '' },
            { name: 'New benefit' },
          ]}
        />

        <BenefitNewEditForm onSubmit={handleCreateProjectSubmit} />
      </Container>
    </Page>
  )
}
