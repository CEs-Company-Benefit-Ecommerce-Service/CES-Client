// @mui
import {
  Box,
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
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Role } from 'src/@types/@ces'
import { Debt, ReceiptStatus } from 'src/@types/@ces/debt'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Iconify from 'src/components/Iconify'
import LoadingScreen from 'src/components/LoadingScreen'
import Page from 'src/components/Page'
import Scrollbar from 'src/components/Scrollbar'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
} from 'src/components/table'
import RoleBasedGuard from 'src/guards/RoleBasedGuard'
import { useDebt } from 'src/hooks/@ces/useDebt'
import useTable, { emptyRows, getComparator } from 'src/hooks/useTable'
import useTabs from 'src/hooks/useTabs'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import DebtTableRow from 'src/sections/@ces/debt/DebtTableRow'
import DebtTableToolbar from 'src/sections/@ces/debt/DebtTableToolbar'

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'new', 'paid']

const ROLE_OPTIONS = ['supplier', 'shipper']

const TABLE_HEAD = [
  { id: 'comapany?.name', label: 'Company ', align: 'left' },
  { id: 'total', label: 'Total', align: 'left' },
  { id: 'name', label: 'Note', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
]

OrderPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default function OrderPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable()

  const { push } = useRouter()
  const { data, isLoading } = useDebt({})
  const tableData: Debt[] = data?.data ?? []

  const [filterName, setFilterName] = useState('')

  const [filterStt, setFilterStatus] = useState('supplier')

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all')

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName)
    setPage(0)
  }
  console.log(filterStatus)

  const handleFilterStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterStatus(event.target.value)
  }

  const handleDeleteRows = (selected: string[]) => {
    setSelected([])
  }

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterName,
    filterStt,
    filterStatus,
  })

  const denseHeight = dense ? 52 : 72
  if (isLoading) {
    return <LoadingScreen />
  }
  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterStt)
  const handleViewRow = (id: string) => {
    push(PATH_CES.debt.detail(id))
  }

  return (
    <RoleBasedGuard hasContent roles={[Role['System Admin']]}>
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
              {STATUS_OPTIONS.map((tab) => (
                <Tab disableRipple key={tab} label={tab} value={tab} />
              ))}
            </Tabs>

            <Divider />
            <DebtTableToolbar
              filterName={filterName}
              filterStatus={filterStt}
              onFilterName={handleFilterName}
              onFilterStatus={handleFilterStatus}
              optionsStatus={ROLE_OPTIONS}
            />

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
                        tableData.map((row) => row.id)
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
                    {dataFiltered
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((row) => (
                        <DebtTableRow
                          key={row.id}
                          row={row}
                          selected={selected.includes(row.id)}
                          onSelectRow={() => onSelectRow(row.id)}
                          onViewRow={() => handleViewRow(row.id)}
                          onDeleteRow={() => handleViewRow(row.id)}
                        />
                      ))}

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
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
  filterStt,
  filterStatus,
}: {
  tableData: Debt[]
  comparator: (a: any, b: any) => number
  filterName: string
  filterStatus: string
  filterStt: string
}) {
  const stabilizedThis = tableData.map((el, index) => [el, index] as const)
  function mapStatus(status: number) {
    const rs = Object.values(ReceiptStatus)
    return rs[status].toLocaleLowerCase()
  }
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  tableData = stabilizedThis.map((el) => el[0])

  if (filterName) {
    tableData = tableData.filter(
      (item: Record<string, any>) =>
        item?.company.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    )
  }

  if (filterStt !== 'supplier') {
    tableData = tableData.filter((item: Record<string, any>) => {
      item.status === filterStt
    })
  }

  if (filterStatus !== 'all') {
    tableData = tableData.filter(
      (item: Record<string, any>) => mapStatus(item.status) === filterStatus
    )
  }

  return tableData
}
