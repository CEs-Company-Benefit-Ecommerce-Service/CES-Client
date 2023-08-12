import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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
  Typography,
  useTheme,
} from '@mui/material'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Order, Params, Status } from 'src/@types/@ces'
import Iconify from 'src/components/Iconify'
import Label from 'src/components/Label'
import Scrollbar from 'src/components/Scrollbar'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
  TableSkeleton,
} from 'src/components/table'
import { useOrderBySupplierId, useOrderDetail } from 'src/hooks/@ces'
import useTable, { emptyRows, getComparator } from 'src/hooks/useTable'
import useTabs from 'src/hooks/useTabs'
import { fCurrency } from 'src/utils/formatNumber'
import LoadingTable from 'src/utils/loadingTable'
import CompanyOrderTableRow from '../company/order/CompanyOrderTableRow'
import CompanyOrderTableToolbar from '../company/order/CompanyOrderTableToolbar'

// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all', 'new', 'ready', 'shipping', 'complete', 'cancel']
const ROLE_OPTIONS = ['supplier', 'shipper']
const FILTER_OPTIONS = ['descending', 'ascending']

const TABLE_HEAD = [
  { id: 'orderCode', label: 'Order Code', align: 'left' },
  { id: 'employeeName', label: 'Employee', align: 'left' },
  { id: 'total', label: 'Amount', align: 'left' },
  { id: 'createdAt', label: 'Date', align: 'left' },
  // { id: 'updatedAt', label: 'Updated At', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
]

// ----------------------------------------------------------------------

type Props = {
  supplierId?: string
}
export default function OrderTableCustom({ supplierId }: Props) {
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

  const [params, setParams] = useState<Partial<Params>>()

  const { data: orderSup, isLoading: isOrderLoading } = useOrderBySupplierId({
    supplierId: supplierId,
    params,
  })

  const [filterStt, setFilterStatus] = useState('supplier')
  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all')
  const [filterAttribute, setFilterAttribute] = useState('')
  const [filterOptions, setFilterOptions] = useState('')
  const [timeoutName, setTimeoutName] = useState<any>()
  const [filterName, setFilterName] = useState('')
  const [orderValueType, setOrderValueType] = useState('monthly orders')

  const tableData: Order[] = orderSup?.data ?? []
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
    // push(PATH_CES.order.detail(paramCase(id)))
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

  const [open, setOpen] = useState(false)
  const [orderId, setOrderId] = useState('')

  const handleViewRow = (id: string) => {
    setOpen(true)
    setOrderId(id)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Card>
      {open && <OrderDetails handleClose={handleClose} id={orderId} />}
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

      <CompanyOrderTableToolbar
        orderValueType={orderValueType}
        orderType={null}
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
      <LoadingTable isValidating={isOrderLoading} />

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
              {isOrderLoading
                ? Array.from(Array(rowsPerPage)).map((e) => (
                    <TableSkeleton sx={{ height: denseHeight, px: dense ? 1 : 0 }} key={e} />
                  ))
                : dataFiltered.map((row) => (
                    <CompanyOrderTableRow
                      key={row.id}
                      row={row}
                      selected={selected.includes(row.id)}
                      onSelectRow={() => onSelectRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                      onClickRow={() => handleClickRow(row.id)}
                    />
                  ))}

              {!isOrderLoading && (
                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(page + 1, rowsPerPage, orderSup?.metaData?.total)}
                />
              )}

              <TableNoData isNotFound={isNotFound && !isOrderLoading} />
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Box sx={{ position: 'relative' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={orderSup?.metaData?.total || 0}
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

// ----------------------------------------------------------------

type OrderDetailsProps = {
  id?: string
  handleClose: any
}

function OrderDetails({ handleClose, id }: OrderDetailsProps) {
  const { data } = useOrderDetail({
    id,
  })
  const theme = useTheme()

  const rs = Object.values(Status).filter((value) => typeof value === 'string')

  const orderDetails = data?.data

  return (
    <Dialog fullWidth maxWidth="md" open onClose={handleClose}>
      <DialogTitle>
        <Stack direction={'row'} spacing={2} alignItems={'start'}>
          <Typography variant="inherit"> {data.data?.orderCode} </Typography>

          <Label
            variant={theme.palette.mode === 'light' ? 'ghost' : 'ghost'}
            color={
              (orderDetails?.status === 1 && 'primary') ||
              (orderDetails?.status === 2 && 'warning') ||
              (orderDetails?.status === 3 && 'info') ||
              (orderDetails?.status === 4 && 'success') ||
              (orderDetails?.status === 5 && 'error') ||
              'default'
            }
          >
            {rs[orderDetails!.status]}
          </Label>
        </Stack>

        {/* <Typography variant="body2"> </Typography> */}
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Typography variant="subtitle1">Details</Typography>
        {orderDetails?.orderDetails?.map((e) => (
          <Box key={e.productId} my={2}>
            <Stack spacing={10} direction={'row'} alignItems={'center'}>
              <Stack flex={1} direction={'row'} spacing={2}>
                <Box>
                  <Image
                    style={{
                      borderRadius: 8,
                    }}
                    alt={e.productId}
                    src={e.product.imageUrl}
                    height={50}
                    width={50}
                    objectFit="cover"
                  />
                </Box>

                <Box>
                  <Typography variant="body1">{e.product.name}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {e.product.id}
                  </Typography>
                </Box>
              </Stack>
              <Typography variant="body1">x{e.quantity}</Typography>
              <Typography variant="body1">{fCurrency(e.price)}</Typography>
            </Stack>
            <Divider sx={{ borderStyle: 'dashed', mt: 0.5 }} />
          </Box>
        ))}
        <Stack direction={'row'} justifyContent={'flex-end'} spacing={10}>
          <Stack alignItems={'flex-end'} spacing={2}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Subtotal
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Fee
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.primary' }}>
              Total
            </Typography>
          </Stack>
          <Stack alignItems={'flex-end'} spacing={2}>
            <Typography variant="body2">
              {fCurrency(orderDetails?.total ? orderDetails?.total - 5000 : 0)}
            </Typography>
            <Typography variant="body2">{fCurrency(5000)}</Typography>
            <Typography variant="body1" sx={{ color: 'text.primary' }}>
              {fCurrency(orderDetails?.total || 0)}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
