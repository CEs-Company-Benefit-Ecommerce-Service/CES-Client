// @mui
import {
  Box,
  Button,
  Card,
  Container,
  FormControlLabel,
  IconButton,
  Switch,
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
import { useMemo, useState } from 'react'
import { CompanyData, Params } from 'src/@types/@ces'
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
  TableSkeleton,
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
import LoadingTable from 'src/utils/loadingTable'

// ----------------------------------------------------------------------

CompanyPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------
const FILTER_OPTIONS = ['descending', 'ascending']
const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'limits', label: 'Limit', align: 'left' },
  { id: 'used', label: 'Used', align: 'left' },
  { id: 'expiredDate', label: 'ExpiredDate', align: 'left' },
  { id: 'createdat', label: 'Created At', align: 'left' },
  { id: 'updatedat', label: 'Updated At', align: 'left' },
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

  const [params, setParams] = useState<Partial<Params>>()
  const [timeoutName, setTimeoutName] = useState<any>()
  const [filterAttribute, setFilterAttribute] = useState('')
  const [filterOptions, setFilterOptions] = useState('')
  const { enqueueSnackbar } = useSnackbar()

  const { data, isLoading } = useCompanyList({ params })
  useMemo(
    () =>
      setParams({
        Page: page + 1,
        Size: rowsPerPage,
        Sort: filterAttribute == '' ? 'createdAt' : filterAttribute,
        Order: filterOptions == '' ? 'desc' : filterOptions,
      }),
    [filterAttribute, filterOptions, page, rowsPerPage]
  )
  const companyList = data?.data || []

  const [filterName, setFilterName] = useState('')

 

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all')
  const filterNameFuction = (value: string) => {
    setParams({ Page: page + 1, Size: rowsPerPage, Name: value })
  }
  const handleFilterName = (filterName: string) => {
    setFilterName(filterName)

    if (timeoutName) {
      clearTimeout(timeoutName)
    }

    const newTimeoutname = setTimeout(() => {
      filterNameFuction(filterName)
    }, 300)
    setTimeoutName(newTimeoutname)
  }
  const handleClearFilter = () => {
    setFilterAttribute('')
    setFilterName('')
    setFilterOptions('')
  }
  const handleFilterOptions = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions(event.target.value)
  }
  const handleFilterAttribute = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterAttribute(event.target.value)
  }

  const handleDeleteRow = (id: string) => {
    confirmDialog('Do you really want to delete this account ?', async () => {
      try {
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
          push(PATH_CES.transaction.detail(rs?.data?.id))
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
    filterStatus,
  })

  const denseHeight = dense ? 52 : 72

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus)

  return (
    <Page title="Company: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Company List"
          links={[{ name: 'Dashboard', href: '' }, { name: 'Company', href: '' }, { name: 'List' }]}
          action={
            <NextLink href={{ pathname: PATH_CES.account.new('enterprise') }} passHref>
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
            {/* {statusOptions.map((tab) => (
              <Tab disableRipple key={tab.code} label={tab.label} value={tab.code} />
            ))} */}
          </Tabs>

          <CompanyTableToolbar
            filterName={filterName}
            onFilterName={handleFilterName}
            filterOptions={filterOptions}
            filterAttribute={filterAttribute}
            optionsSort={TABLE_HEAD}
            optionsOrderBy={FILTER_OPTIONS}
            onFilterAttribute={handleFilterAttribute}
            onFilterOptions={handleFilterOptions}
            handleClearFilter={handleClearFilter}
          />
          <LoadingTable isValidating={isLoading} />

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
                  {isLoading
                    ? Array.from(Array(rowsPerPage)).map((e) => (
                        <TableSkeleton sx={{ height: denseHeight, px: dense ? 1 : 0 }} key={e} />
                      ))
                    : dataFiltered.map((row) => (
                        <CompanyTableRow
                          key={`${row.id}`}
                          row={row}
                          isValidating={isLoading}
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
              count={data?.metaData?.total}
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
}: {
  tableData: CompanyData[]
  comparator: (a: any, b: any) => number
  filterName: string
  filterStatus: string
}) {
  return tableData
}
