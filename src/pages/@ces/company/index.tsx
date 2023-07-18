// @mui
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  FormControlLabel,
  IconButton,
  Switch,
  Tab,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tabs,
  Tooltip,
} from '@mui/material'
import { paramCase } from 'change-case'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { ACCOUNT_STATUS_OPTIONS_SA, CompanyData } from 'src/@types/@ces'
import { debtApi } from 'src/api-client/debt'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Iconify from 'src/components/Iconify'
import Page from 'src/components/Page'
import Scrollbar from 'src/components/Scrollbar'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
} from 'src/components/table'
import { useCompanyList } from 'src/hooks/@ces'
import useSettings from 'src/hooks/useSettings'
import useTable, { emptyRows, getComparator } from 'src/hooks/useTable'
import useTabs from 'src/hooks/useTabs'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import CompanyTableRow from 'src/sections/@ces/company/CompanyTableRow'
import CompanyTableToolbar from 'src/sections/@ces/company/CompanyTableToolbar'
import { confirmDialog } from 'src/utils/confirmDialog'

// ----------------------------------------------------------------------

CompanyPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'limits', label: 'Limit', align: 'left' },
  { id: 'used', label: 'Used', align: 'left' },
  { id: 'expiredDate', label: 'ExpiredDate', align: 'left' },
  { id: '' },
]

// ----------------------------------------------------------------------

export default function CompanyPage() {
  const { themeStretch } = useSettings()

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    // setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable()

  const { push } = useRouter()

  // const { user } = useAuth()

  // const roleOptions = user?.role === Role['System Admin'] ? ROLE_OPTIONS_SA : ROLE_OPTIONS_EA
  const statusOptions = ACCOUNT_STATUS_OPTIONS_SA

  const { enqueueSnackbar } = useSnackbar()

  const { data } = useCompanyList({
    params: { Page: '1' },
    // options: {
    //   revalidateOnFocus: false,
    //   revalidateOnMount: false,
    //   dedupingInterval: 60 * 60 * 1000,
    // },
  })
  const companyList = data?.data || []

  const [filterName, setFilterName] = useState('')

  const [filterRole, setFilterRole] = useState('all')

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all')

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName)
    setPage(0)
  }

  // const handleFilterRole = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setFilterRole(event.target.value)
  //   setPage(0)
  // }

  const handleDeleteRow = (id: string) => {
    confirmDialog('Do you really want to delete this account ?', async () => {
      try {
        // await companyApi.delete(id)
        // mutate()
        // mutate(accountApi.delete(id), {
        //   optimisticData: [],
        // })

        enqueueSnackbar('Delete successful')
      } catch (error) {
        enqueueSnackbar('Delete failed', { variant: 'error' })

        console.error(error)
      }
    })
  }

  const handleDueRow = (id: string) => {
    confirmDialog('Do you really want to create debt this account ?', async () => {
      try {
        const rs = await debtApi.create(id)
        if (rs.data) {
          push(PATH_CES.debt.detail(rs?.data?.id))
          enqueueSnackbar('Create successful')
        } else {
          enqueueSnackbar('This company has no debt', { variant: 'warning' })
        }
      } catch (error) {
        enqueueSnackbar('Create failed', { variant: 'error' })
        console.error(error)
      }
    })
  }

  const handleDeleteRows = (selected: string[]) => {
    console.log('delete all account action', selected)
  }

  const handleEditRow = (id: string) => {
    push(PATH_CES.company.edit(paramCase(id)))
  }

  const handleClickRow = (id: string) => {
    push(PATH_CES.company.detail(paramCase(id)))
  }

  const dataFiltered = applySortFilter({
    tableData: companyList,
    comparator: getComparator(order, orderBy),
    filterName,
    filterRole,
    filterStatus,
  })

  const denseHeight = dense ? 52 : 72

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterRole) ||
    (!dataFiltered.length && !!filterStatus)

  return (
    <Page title="Company: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Company List"
          links={[{ name: 'Dashboard', href: '' }, { name: 'Company', href: '' }, { name: 'List' }]}
          action={
            <NextLink href={{ pathname: PATH_CES.account.new,}} passHref>
              <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New Company
              </Button>
            </NextLink>
          }
        />

        <Card>
          <Tabs
            allowScrollButtonsMobile
            variant="scrollable"
            scrollButtons="auto"
            value={filterStatus}
            onChange={onChangeFilterStatus}
            sx={{ px: 2, bgcolor: 'background.neutral' }}
          >
            {statusOptions.map((tab) => (
              <Tab disableRipple key={tab.code} label={tab.label} value={tab.code} />
            ))}
          </Tabs>

          <Divider />

          <CompanyTableToolbar
            filterName={filterName}
            // filterRole={filterRole}
            onFilterName={handleFilterName}
            // onFilterRole={handleFilterRole}
            // optionsRole={roleOptions}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
              {selected.length > 0 && (
                <TableSelectedActions
                  dense={dense}
                  numSelected={selected.length}
                  rowCount={companyList.length}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      companyList.map((row) => `${row.id}`)
                    )
                  }
                  actions={
                    true ? (
                      <Tooltip title="Delete">
                        <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                          <Iconify icon={'eva:trash-2-outline'} />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="Add">
                        <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                          <Iconify icon={'material-symbols:add'} />
                        </IconButton>
                      </Tooltip>
                    )
                  }
                />
              )}

              <Table size={dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={companyList.length}
                  numSelected={selected.length}
                  onSort={onSort}
                  onSelectAllRows={(checked) =>
                    onSelectAllRows(
                      checked,
                      companyList.map((row: any) => `${row.id}`)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <CompanyTableRow
                        key={`${row.id}`}
                        row={row}
                        selected={selected.includes(`${row.id}`)}
                        onSelectRow={() => onSelectRow(`${row.id}`)}
                        onDeleteRow={() => handleDeleteRow(`${row.id}`)}
                        onEditRow={() => handleEditRow(`${row.id}`)}
                        onClickRow={() => handleClickRow(`${row.id}`)}
                        onDueRow={() => handleDueRow(row.id)}
                      />
                    ))}

                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page, rowsPerPage, companyList.length)}
                  />

                  <TableNoData isNotFound={isNotFound} />
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <Box sx={{ position: 'relative' }}>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={dataFiltered.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={onChangePage}
              // onPageChange={(e, newPage) => {
              //   onChangePage(e, newPage)
              // }}
              onRowsPerPageChange={onChangeRowsPerPage}
            />

            <FormControlLabel
              control={<Switch checked={dense} onChange={onChangeDense} />}
              label="Dense"
              sx={{ px: 3, py: 1.5, top: 0, position: { md: 'absolute' } }}
            />
          </Box>
        </Card>
      </Container>
    </Page>
  )
}

// ----------------------------------------------------------------------
// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterName,
  filterStatus,
  filterRole,
}: {
  tableData: CompanyData[]
  comparator: (a: any, b: any) => number
  filterName: string
  filterStatus: string
  filterRole: string
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index] as const)

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  tableData = stabilizedThis.map((el) => el[0])

  if (filterName) {
    tableData = tableData.filter(
      (item: Record<string, any>) =>
        item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    )
  }

  if (filterStatus !== 'all') {
    tableData = tableData.filter((item: Record<string, any>) => item.status == filterStatus)
  }

  if (filterRole !== 'all') {
    tableData = tableData.filter((item: Record<string, any>) => item.roleId == filterRole)
  }

  return tableData
}
