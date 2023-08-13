// @mui
import {
  Box,
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
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Params, Role, TransactionHistory } from 'src/@types/@ces'
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
import RoleBasedGuard from 'src/guards/RoleBasedGuard'
import { usePaymentSystem } from 'src/hooks/@ces/usePayment'
import useAuth from 'src/hooks/useAuth'
import useTable, { emptyRows, getComparator } from 'src/hooks/useTable'
import useTabs from 'src/hooks/useTabs'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import DebtTableRow from 'src/sections/@ces/debt/DebtTableRow'
import DebtTableToolbar from 'src/sections/@ces/debt/DebtTableToolbar'
import LoadingTable from 'src/utils/loadingTable'

// ----------------------------------------------------------------------

const FILTER_OPTIONS = ['descending', 'ascending']
const ROLE_OPTIONS = ['supplier', 'shipper']
const TABLE_HEAD = [
  { id: 'companyName', label: 'Company Name', align: 'left' },
  { id: 'total', label: 'Total', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'createdAt', label: 'Created At', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
]

DebtPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default function DebtPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
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
  const { data, isLoading } = usePaymentSystem({ params })
  const tableData: TransactionHistory[] = data?.data ?? []
  const [filterName, setFilterName] = useState('')
  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('Debt')
  const { user } = useAuth()
  const companyId = user?.companyId?.toString()
  const role = user?.role

  useEffect(
    () =>
      setParams({
        Type: '6',
        Status: 3,
        CompanyId: role != 3 ? '' : companyId,
        Sort: filterAttribute == '' ? 'createdAt' : filterAttribute,
        Order: filterOptions == '' ? 'desc' : filterOptions,
        Page: page + 1,
        Size: rowsPerPage,
      }),
    [filterAttribute, filterOptions, page, rowsPerPage]
  )
  const filterNameFuction = (value: string) => {
    setParams({ Page: page + 1, Size: rowsPerPage, Name: value })
  }

  console.log({ page, rowsPerPage, total: data?.metaData?.total })

  const handleFilterOptions = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions(event.target.value)
  }
  const handleFilterAttribute = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterAttribute(event.target.value)
  }
  const handleClearFilter = () => {
    setFilterAttribute('')
    setFilterName('')
    setFilterOptions('')
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

  const handleDeleteRows = (selected: string[]) => {
    setSelected([])
  }

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
  })

  const denseHeight = dense ? 52 : 72

  const isNotFound =
    (!dataFiltered.length && !!filterName) || (!dataFiltered.length && !!filterStatus)

  const handleViewRow = (id: string) => {
    push(PATH_CES.debt.detail(id))
  }

  return (
    <RoleBasedGuard hasContent roles={[Role['System Admin'], Role['Enterprise Admin']]}>
      <Page title="Debt: List">
        <Container>
          <HeaderBreadcrumbs
            heading="Debt List"
            links={[{ name: 'Dashboard', href: '' }, { name: 'Debt', href: '' }, { name: 'List' }]}
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
              {/* {STATUS_OPTIONS.map((tab) => (
                <Tab disableRipple key={tab} label={tab} value={tab} />
              ))} */}
            </Tabs>

            <DebtTableToolbar
              filterName={filterName}
              onFilterName={handleFilterName}
              optionsStatus={ROLE_OPTIONS}
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
                    rowCount={tableData.length}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        tableData.map((row) => `${row.id}`)
                      )
                    }
                    actions={
                      <Tooltip title="Delete">
                        <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                          <Iconify icon={'eva:trash-2-outline'} />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                )}

                <Table size={dense ? 'small' : 'medium'}>
                  <TableHeadCustom
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={tableData.length}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        tableData.map((row) => row.id)
                      )
                    }
                  />
                  <TableBody>
                    {isLoading
                      ? Array.from(Array(rowsPerPage)).map((e) => (
                          <TableSkeleton sx={{ height: denseHeight, px: dense ? 1 : 0 }} key={e} />
                        ))
                      : dataFiltered.map((row) => (
                          <DebtTableRow
                            key={`${row.id}`}
                            row={row}
                            isValidating={isLoading}
                            selected={selected.includes(row.id)}
                            onSelectRow={() => onSelectRow(row.id)}
                            onViewRow={() => handleViewRow(row.id)}
                            onDeleteRow={() => handleViewRow(row.id)}
                          />
                        ))}
                    {!isLoading && (
                      <TableEmptyRows
                        height={denseHeight}
                        emptyRows={emptyRows(page + 1, rowsPerPage, data?.metaData?.total)}
                      />
                    )}
                    <TableNoData isNotFound={isNotFound && !isLoading} />
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>

            <Box sx={{ position: 'relative' }}>
              <TablePagination
                rowsPerPageOptions={[5, 10]}
                component="div"
                count={data?.metaData?.total || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={onChangePage}
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
    </RoleBasedGuard>
  )
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterName,
}: {
  tableData: TransactionHistory[]
  comparator: (a: any, b: any) => number
  filterName: string
}) {
  return tableData
}
