// @mui
import {
  Box,
  Card, Divider,
  FormControlLabel,
  IconButton,
  Stack,
  Switch,
  Tab,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tabs,
  Tooltip,
  useTheme
} from '@mui/material'
import { paramCase } from 'change-case'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Params } from 'src/@types/@ces'
import { Order, Status } from 'src/@types/@ces/order'
import Iconify from 'src/components/Iconify'
import Scrollbar from 'src/components/Scrollbar'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
  TableSkeleton
} from 'src/components/table'
import RoleBasedGuard from 'src/guards/RoleBasedGuard'
import { useOrder, useOrderCompId } from 'src/hooks/@ces/useOrder'
import { useOrderByCompanyId } from 'src/hooks/@ces/usePayment'
import useAuth from 'src/hooks/useAuth'
import useTable, { emptyRows, getComparator } from 'src/hooks/useTable'
import useTabs from 'src/hooks/useTabs'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import OrderTableRow from 'src/sections/@ces/order/OrderTableRow'
import OrderTableToolbar from 'src/sections/@ces/order/OrderTableToolbar'
import InvoiceAnalytic from 'src/sections/@dashboard/invoice/InvoiceAnalytic'
import LoadingTable from 'src/utils/loadingTable'

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'new', 'ready', 'shipping', 'complete', 'cancel']

const ROLE_OPTIONS = ['supplier', 'shipper']

const FILTER_OPTIONS = ['descending', 'ascending']
const ORDER_TYPE = ['monthly orders', 'all orders']
const TABLE_HEAD = [
  { id: 'ordercode', label: 'Order Code', align: 'left' },
  { id: 'total', label: 'Total', align: 'left' },
  { id: 'companyname', label: 'Company Name', align: 'left' },
  { id: 'createdat', label: 'Created At', align: 'left' },
  { id: 'updatedat', label: 'Updated At', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
]

EaOrderTableCustom.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

export default function EaOrderTableCustom() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    // setPage,
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
  const { user } = useAuth()
  const role = user?.role
  const theme = useTheme()
  const compId = user?.companyId?.toString()
  const { push } = useRouter()

  const [params, setParams] = useState<Partial<Params>>()
  const { data, isValidating, isLoading: supLoading } = useOrder({ params })
  const { data: orders, isLoading: monthLoading } = useOrderByCompanyId({
    companyId: user?.companyId?.toString(),
    params,
  })
  const { data: compOrder, isLoading: eaLoading } = useOrderCompId({ companyId: compId, params })

  const [filterStt, setFilterStatus] = useState('supplier')
  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all')
  const [filterAttribute, setFilterAttribute] = useState('')
  const [filterOptions, setFilterOptions] = useState('')
  const [timeoutName, setTimeoutName] = useState<any>()
  const [filterName, setFilterName] = useState('')
  const [orderValueType, setOrderValueType] = useState('all orders')

  const tableData: Order[] =
    role != 3
      ? data?.data ?? []
      : orderValueType == 'all orders'
      ? compOrder?.data ?? []
      : orders?.data.orders ?? []
  const total =
    role != 3
      ? data?.metaData?.total || []
      : orderValueType == 'all orders'
      ? compOrder?.metaData?.total ?? []
      : orders?.data?.orders?.length ?? []
  const issLoading =
    role != 3 ? supLoading : orderValueType == 'all orders' ? monthLoading : eaLoading

  useEffect(() => {
    const statusIndex = getStatusIndex(filterStatus)
    if (statusIndex === -1) {
      setParams({
        Page: page + 1,
        Size: rowsPerPage,
        Sort: filterAttribute == '' ? 'createdAt' : filterAttribute,
        Order: filterOptions == '' ? 'desc' : filterOptions,
      })
    } else {
      setParams({
        Page: page + 1,
        Size: rowsPerPage,
        Status: statusIndex,
        Sort: filterAttribute == '' ? 'createdAt' : filterAttribute,
        Order: filterOptions == '' ? 'desc' : filterOptions,
      })
    }
  }, [page, rowsPerPage, filterStatus, filterAttribute, filterOptions])

  const handleFilterOptions = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions(event.target.value)
  }

  const handleOrderType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOrderValueType(event.target.value)
  }
  const handleFilterAttribute = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterAttribute(event.target.value)
  }
  function getStatusIndex(status: string): number {
    return Status[status as keyof typeof Status] || -1
  }
  const handleClearFilter = () => {
    setFilterAttribute('')
    setFilterOptions('')
  }
  const filterNameFuction = (value: string) => {
    setParams({ Page: page + 1, Size: rowsPerPage, OrderCode: value })
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
  const handleFilterStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterStatus(event.target.value)
  }

  const handleDeleteRows = (selected: string[]) => {
    setSelected([])
  }

  const handleClickRow = (id: string) => {
    push(PATH_CES.order.detail(paramCase(id)))
  }

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
    filterOptions,
    filterStt,
    orderValueType,
    filterAttribute,
    filterStatus,
  })

  const denseHeight = dense ? 52 : 72
  const isNotFound =
    (!dataFiltered.length && !!filterOptions) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterStt) ||
    (!dataFiltered.length && !!orderValueType) ||
    (!dataFiltered.length && !!filterAttribute)
  const handleViewRow = (id: string) => {
    push(PATH_CES.order.detail(id))
  }

  return (
    <RoleBasedGuard hasContent>
      <Card sx={{ mb: 5 }}>
        <Scrollbar>
          <Stack
            direction="row"
            divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
            sx={{ py: 2 }}
          >
            <InvoiceAnalytic
              title="Total Order"
              total={tableData.length}
              percent={100}
              price={100000}
              icon="ic:round-receipt"
              description="orders"
              color={theme.palette.info.main}
            />
            <InvoiceAnalytic
              title="Used"
              total={123123}
              percent={1}
              price={123151521}
              icon="eva:checkmark-circle-2-fill"
              color={theme.palette.success.main}
            />
            {/* <InvoiceAnalytic
            title="Unpaid"
            total={123123}
            percent={1}
            price={123151521}
            icon="eva:clock-fill"
            color={theme.palette.warning.main}
          />
          <InvoiceAnalytic
            title="Overdue"
            total={123123}
            percent={1}
            price={123151521}
            icon="eva:bell-fill"
            color={theme.palette.error.main}
          /> */}
            <InvoiceAnalytic
              title="payment term"
              total={123123}
              percent={1}
              price={123151521}
              icon="eva:file-fill"
              color={theme.palette.text.secondary}
            />
          </Stack>
        </Scrollbar>
      </Card>
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
        <OrderTableToolbar
          orderValueType={orderValueType}
          // orderType={role == 3 ? ORDER_TYPE : null}
          filterName={filterName}
          filterOptions={filterOptions}
          filterStatus={filterStt}
          filterAttribute={filterAttribute}
          optionsSort={TABLE_HEAD}
          optionsOrderBy={FILTER_OPTIONS}
          onFilterAttribute={handleFilterAttribute}
          onFilterOptions={handleFilterOptions}
          onFilterStatus={handleFilterStatus}
          optionsStatus={ROLE_OPTIONS}
          onFilterName={handleFilterName}
          handleOrderType={handleOrderType}
          handleClearFilter={handleClearFilter}
        />
        <LoadingTable isValidating={issLoading} />

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
                {issLoading
                  ? Array.from(Array(rowsPerPage)).map((e) => (
                      <TableSkeleton sx={{ height: denseHeight, px: dense ? 1 : 0 }} key={e} />
                    ))
                  : dataFiltered.map((row) => (
                      <OrderTableRow
                        key={row.id}
                        row={row}
                        isValidating={isValidating}
                        selected={selected.includes(row.id)}
                        onSelectRow={() => onSelectRow(row.id)}
                        onViewRow={() => handleViewRow(row.id)}
                        onClickRow={() => handleClickRow(row.id)}
                      />
                    ))}

                {!issLoading && (
                  <TableEmptyRows
                    height={denseHeight}
                    emptyRows={emptyRows(page + 1, rowsPerPage, total)}
                  />
                )}

                <TableNoData isNotFound={isNotFound && !issLoading} />
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Box sx={{ position: 'relative' }}>
          <TablePagination
            rowsPerPageOptions={[5, 10]}
            component="div"
            count={total | 0}
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
    </RoleBasedGuard>
  )
}

// ----------------------------------------------------------------------

function applySortFilter({
  tableData,
  comparator,
  filterOptions,
  filterAttribute,
  orderValueType,
  filterStt,
  filterStatus,
}: {
  tableData: Order[]
  comparator: (a: any, b: any) => number
  filterStatus: string
  filterOptions: string
  orderValueType: string
  filterAttribute: string
  filterStt: string
}) {
  return tableData
}
