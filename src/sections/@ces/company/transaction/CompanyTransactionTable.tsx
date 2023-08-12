import {
  Box,
  Card,
  FormControlLabel,
  Switch,
  Tab,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tabs
} from '@mui/material'
import { useEffect, useState } from 'react'
import { Params, TransactionHistory } from 'src/@types/@ces'
import Scrollbar from 'src/components/Scrollbar'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
  TableSkeleton
} from 'src/components/table'
import { usePayment } from 'src/hooks/@ces/usePayment'
import useTable, { emptyRows } from 'src/hooks/useTable'
import useTabs from 'src/hooks/useTabs'
import LoadingTable from 'src/utils/loadingTable'
import CompanyTransactionTableRow from './CompanyTransactionTableRow'
import CompanyTransactionTableToolbar from './CompanyTransactionTableToolbar'

// ----------------------------------------------------------------------

const FILTER_OPTIONS = ['descending', 'ascending']

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
    //
    selected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable()

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
  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('paid')
  const STATUS_OPTIONS = ['paid', 'transfer']
  const TABLE_HEAD =
    filterStatus === 'paid'
      ? [
          { id: 'invoiceId', label: 'Id', align: 'left' },
          { id: 'createdAt', label: 'Date', align: 'left' },
          { id: 'total', label: 'Amount', align: 'left' },
          { id: 'type', label: 'Method', align: 'left' },
          { id: 'status', label: 'Status', align: 'left' },
          { id: '' },
        ]
      : [
          { id: 'id', label: 'Id', align: 'left' },
          { id: 'createdAt', label: 'Created At', align: 'left' },
          { id: 'total', label: 'Amount', align: 'left' },
          { id: 'description', label: 'Description', align: 'left' },
          { id: '' },
        ]
  // const DATA = data
  // const tableData: TransactionHistory[] = data?.data || []

  const DATA = data
  const tableData: TransactionHistory[] = data?.data || []

  const [filterName, setFilterName] = useState('')

  useEffect(() => {
    if (filterStatus === 'paid') {
      setParams({
        Status: 1,
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

  const denseHeight = dense ? 52 : 72

  const isNotFound = (!tableData.length && !!filterName) || (!tableData.length && !!filterStatus)
  //  ||
  // (!tableData.length && !!filterStt)
  const handleViewRow = (id: string) => {}

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
        {STATUS_OPTIONS.map((tab) => (
          <Tab disableRipple key={tab} label={tab} value={tab} />
        ))}
      </Tabs>

      <CompanyTransactionTableToolbar
        filterName={filterName}
        onFilterName={handleFilterName}
        // optionsStatus={ROLE_OPTIONS}
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
