// @mui
import { Container, Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
// assets
import { Role } from 'src/@types/@ces'
import { SeoIllustration } from 'src/assets'
import { useReportEA, useReportSA } from 'src/hooks/@ces'
import { useOrderByCompanyId } from 'src/hooks/@ces/usePayment'
import AppOrder from 'src/sections/@dashboard/general/app/@ces/AppOrder'
// _mock_
// components
import Page from '../../components/Page'
// hooks
import useAuth from '../../hooks/useAuth'
import useSettings from '../../hooks/useSettings'
// layouts
import Layout from '../../layouts'
// sections
import { AppWelcome, AppWidgetSummary } from '../../sections/@dashboard/general/app'

// ----------------------------------------------------------------------

GeneralApp.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function GeneralApp() {
  const { user } = useAuth()

  const theme = useTheme()

  const { data: orders } = useOrderByCompanyId({ companyId: user?.companyId?.toString() })
  const { themeStretch } = useSettings()
  const { data: reportSAData } = useReportSA({ disabled: user?.role !== Role['System Admin'] })
  const { data: reportEAData } = useReportEA({ disabled: user?.role !== Role['Enterprise Admin'] })
  return (
    <Page title="General: App">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <Grid container spacing={3}>
          {user?.role == Role['Supplier Admin'] && (
            <Grid item xs={12} md={12}>
              <AppWelcome
                title={`Welcome back! \n ${user?.name}`}
                description="Supplier Admin"
                img={
                  <SeoIllustration
                    sx={{
                      p: 3,
                      width: 360,
                      margin: { xs: 'auto', md: 'inherit' },
                    }}
                  />
                }
                // action={<Button variant="contained">Go Now</Button>}
              />
            </Grid>
          )}
          {/* <Grid item xs={12} md={4}>
            <AppFeatured list={_appFeatured} />
          </Grid> */}

          {reportSAData?.data && (
            <>
              <Grid item xs={12} md={6}>
                <AppWidgetSummary
                  title="Total revenue"
                  total={reportSAData?.data?.totalRevenue || 0}
                  chartColor={theme.palette.primary.main}
                  chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <AppWidgetSummary
                  title="Total company used"
                  total={reportSAData?.data?.totalCompanyUsed || 0}
                  chartColor={theme.palette.chart.blue[0]}
                  chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <AppWidgetSummary
                  title="Total company"
                  total={reportSAData?.data?.companyCount || 0}
                  chartColor={theme.palette.chart.red[0]}
                  chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <AppWidgetSummary
                  title="Total end user"
                  total={reportSAData?.data?.employeeCount || 0}
                  chartColor={theme.palette.chart.yellow[0]}
                  chartData={[8, 9, 31, 8, 16, 37, 8, 33, 46, 31]}
                />
              </Grid>
            </>
          )}

          {reportEAData?.data && (
            <>
              <Grid item xs={12} md={6}>
                <AppWidgetSummary
                  title="Total current used"
                  total={reportEAData?.data?.used || 0}
                  chartColor={theme.palette.primary.main}
                  chartData={[5, 18, 12, 51, 68, 11, 39, 37, 27, 20]}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <AppWidgetSummary
                  title="Total order complete"
                  total={reportEAData?.data?.orderCount || 0}
                  chartColor={theme.palette.chart.blue[0]}
                  chartData={[20, 41, 63, 33, 28, 35, 50, 46, 11, 26]}
                />
              </Grid>
            </>
          )}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppCurrentDownload
              title="Current Download"
              chartColors={[
                theme.palette.primary.lighter,
                theme.palette.primary.light,
                theme.palette.primary.main,
                theme.palette.primary.dark,
              ]}
              chartData={[
                { label: 'Mac', value: 12244 },
                { label: 'Window', value: 53345 },
                { label: 'iOS', value: 44313 },
                { label: 'Android', value: 78343 },
              ]}
            />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={8}>
            <AppAreaInstalled
              title="Area Installed"
              subheader="(+43%) than last year"
              chartLabels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']}
              chartData={[
                {
                  year: '2019',
                  data: [
                    { name: 'Asia', data: [10, 41, 35, 51, 49, 62, 69, 91, 148] },
                    { name: 'America', data: [10, 34, 13, 56, 77, 88, 99, 77, 45] },
                  ],
                },
                {
                  year: '2020',
                  data: [
                    { name: 'Asia', data: [148, 91, 69, 62, 49, 51, 35, 41, 10] },
                    { name: 'America', data: [45, 77, 99, 88, 77, 56, 13, 34, 10] },
                  ],
                },
              ]}
            />
          </Grid> */}

          {user?.role == Role['Enterprise Admin'] && orders.data && (
            <Grid item xs={12} lg={12}>
              <AppOrder
                // title={`Order in month (${orders.data.orders.length})`}
                title={`Current complete order (${orders?.data.orders?.length})`}
                tableData={
                  orders?.data?.orders
                    ?.filter((x) => x.status == 4)
                    // .sort((x, y) => y.total - x.total)
                    .slice(0, 5) || []
                }
                tableLabels={[
                  { id: 'orderCode', label: 'Order Code' },
                  { id: 'employeeName', label: 'Employee' },
                  { id: 'Date', label: 'Date' },
                  { id: '', label: 'Total' },
                  { id: '' },
                ]}
              />
            </Grid>
          )}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTopRelated title="Top Related Applications" list={_appRelated} />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <AppTopInstalledCountries title="Top Installed Countries" list={_appInstalled} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTopAuthors title="Top Authors" list={_appAuthors} />
          </Grid> */}

          {/* <Grid item xs={12} md={6} lg={4}>
            <Stack spacing={3}>
              <AppWidget title="Conversion" total={38566} icon={'eva:person-fill'} chartData={48} />
              <AppWidget
                title="Applications"
                total={55566}
                icon={'eva:email-fill'}
                color="warning"
                chartData={75}
              />
            </Stack>
          </Grid> */}
        </Grid>
      </Container>
    </Page>
  )
}
