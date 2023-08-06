import {
  Box,
  Card,
  FormControlLabel,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tabs,
} from '@mui/material'
import { useMemo, useState } from 'react'
import { Params, TransactionHistory } from 'src/@types/@ces'
import Scrollbar from 'src/components/Scrollbar'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
  TableSkeleton,
} from 'src/components/table'
import { usePayment } from 'src/hooks/@ces/usePayment'
import useAuth from 'src/hooks/useAuth'
import useTable, { emptyRows } from 'src/hooks/useTable'
import useTabs from 'src/hooks/useTabs'
import CompanyTransactionTableRow from './CompanyTransactionTableRow'
import CompanyTransactionTableToolbar from './CompanyTransactionTableToolbar'
import { Divider } from '@mui/material'

// ----------------------------------------------------------------------

const FILTER_OPTIONS = ['descending', 'ascending']
const ROLE_OPTIONS = ['supplier', 'shipper']
const TABLE_HEAD = [
  { id: 'invoiceId', label: 'Invoice Id', align: 'left' },
  { id: 'createdAt', label: 'Date', align: 'left' },
  // { id: 'description', label: 'Description', align: 'left' },
  { id: 'total', label: 'Amount', align: 'left' },
  { id: 'type', label: 'Method', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: '' },
]

// ----------------------------------------------------------------------

type Props = {
  companyId: string
  any?: any
}
export default function CompanyTransactionTable({ companyId }: Props) {
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

  // const { push } = useRouter()
  const { user } = useAuth()

  const [params, setParams] = useState<Partial<Params>>()
  const [timeoutName, setTimeoutName] = useState<any>()
  const [filterAttribute, setFilterAttribute] = useState('')
  const [filterOptions, setFilterOptions] = useState('')
  const { data, isLoading } = usePayment({
    params: {
      ...params,
      CompanyId: companyId,
    },
  })
  // const { data: paymentSAData } = usePaymentSystem({ params })
  // const STATUS_OPTIONS = user?.role == Role['Enterprise Admin'] ? ['paid', 'transfer'] : ['paid']
  const DATA = data
  const tableData: TransactionHistory[] = data?.data || []

  const [filterName, setFilterName] = useState('')

  const [filterStt, setFilterStatus] = useState('supplier')

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('paid')

  useMemo(() => {
    if (filterStatus === 'paid') {
      setParams({
        PaymentType: '1',
        Sort: filterAttribute == '' ? 'createdAt' : filterAttribute,
        Order: filterOptions == '' ? 'desc' : filterOptions,
        Page: page + 1,
        Size: rowsPerPage,
      })
    } else {
      setParams({
        Page: page + 1,
        Size: rowsPerPage,
        Type: '4',
        Sort: filterAttribute == '' ? 'createdAt' : filterAttribute,
        Order: filterOptions == '' ? 'desc' : filterOptions,
      })
    }
  }, [filterAttribute, filterOptions, filterStatus, page, rowsPerPage])
  console.log(filterStatus)
  const filterNameFuction = (value: string) => {
    setParams({ Page: page + 1, Size: rowsPerPage, Name: value })
  }
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
  const handleFilterStatus = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterStatus(event.target.value)
  }

  const handleDeleteRows = (selected: string[]) => {
    setSelected([])
  }

  // const dataFiltered = applySortFilter({
  //   tableData,
  //   comparator: getComparator(order, orderBy),
  //   filterName,
  //   filterStt,
  //   filterStatus,
  // })

  const denseHeight = dense ? 52 : 72

  const isNotFound =
    (!tableData.length && !!filterName) ||
    (!tableData.length && !!filterStatus) ||
    (!tableData.length && !!filterStt)
  const handleViewRow = (id: string) => {
    // push(PATH_CES.tra.detail(id))
  }

  return (
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

      <CompanyTransactionTableToolbar
        filterName={filterName}
        filterStatus={filterStt}
        onFilterName={handleFilterName}
        onFilterStatus={handleFilterStatus}
        optionsStatus={ROLE_OPTIONS}
        filterOptions={filterOptions}
        filterAttribute={filterAttribute}
        optionsSort={TABLE_HEAD}
        optionsOrderBy={FILTER_OPTIONS}
        onFilterAttribute={handleFilterAttribute}
        onFilterOptions={handleFilterOptions}
        handleClearFilter={handleClearFilter}
      />
      {/* <LoadingTable isValidating={isLoading} /> */}

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
              // actions={
              //   <Tooltip title="Delete">
              //     <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
              //       <Iconify icon={'eva:trash-2-outline'} />
              //     </IconButton>
              //   </Tooltip>
              // }
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
                : tableData.map((row) => (
                    <CompanyTransactionTableRow
                      key={row.id}
                      row={row}
                      isValidating={isLoading}
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

              <TableNoData isNotFound={isNotFound && !isLoading} />
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Box sx={{ position: 'relative' }}>
        <TablePagination
          rowsPerPageOptions={[5, 10]}
          component="div"
          count={DATA?.metaData?.total || 0}
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

// function applySortFilter({
//   tableData,
//   comparator,
//   filterOptions,
//   filterAttribute,
//   orderValueType,
//   filterStt,
//   filterStatus,
// }: {
//   tableData: TransactionHistory[]
//   comparator: (a: any, b: any) => number
//   filterStatus: string
//   filterOptions: string
//   orderValueType: string
//   filterAttribute: string
//   filterStt: string
// }) {
//   return tableData
// }
