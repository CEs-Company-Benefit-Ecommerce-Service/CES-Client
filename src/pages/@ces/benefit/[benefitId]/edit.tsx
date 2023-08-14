import { Box, Container, Tab, Tabs } from '@mui/material'
import { capitalCase } from 'change-case'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { BenefitPayload } from 'src/@types/@ces'
import { benefitApi } from 'src/api-client'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Iconify from 'src/components/Iconify'
import Page from 'src/components/Page'
import { useBenefitDetails } from 'src/hooks/@ces'
import useSettings from 'src/hooks/useSettings'
import useTabs from 'src/hooks/useTabs'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import BenefitNewEditForm from 'src/sections/@ces/benefit/BenefitNewEditForm'
import BenefitAccountTable from 'src/sections/@ces/benefit/accounts/BenefitAccountTable'
import BenefitMemberTable from 'src/sections/@ces/benefit/members/BenefitMemberTable'

// ----------------------------------------------------------------------

BenefitEditPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function BenefitEditPage() {
  const { themeStretch } = useSettings()

  const { enqueueSnackbar } = useSnackbar()
  const { currentTab, onChangeTab } = useTabs('general')
  const { query, push } = useRouter()
  const { benefitId } = query

  const { data, mutate } = useBenefitDetails({ id: `${benefitId}` })

  const handleEditAccountSubmit = async (payload: BenefitPayload) => {
    try {
      await benefitApi.update(`${benefitId}`, payload)
      mutate()
      enqueueSnackbar('Update success!')
      push(PATH_CES.benefit.root)
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
        <BenefitNewEditForm isEdit currentUser={data?.data} onSubmit={handleEditAccountSubmit} />
      ),
    },
    {
      value: 'members',
      icon: <Iconify icon={'fa6-solid:people-line'} width={20} height={20} />,
      component: (
        <BenefitMemberTable benefitId={`${benefitId}`} groupId={data?.data?.groups[0].id || ''} />
      ),
    },
    {
      value: 'accounts',
      icon: <Iconify icon={'fa6-solid:people-line'} width={20} height={20} />,
      component: (
        <BenefitAccountTable benefitId={`${benefitId}`} groupId={data?.data?.groups[0].id || ''} />
      ),
    },
  ]

  return (
    <Page title="Benefit: Edit Benefit">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Edit benefit"
          links={[
            { name: 'Dashboard', href: '' },
            { name: 'Benefit', href: '' },
            { name: data?.data?.name || (benefitId as string) },
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
  )
}
