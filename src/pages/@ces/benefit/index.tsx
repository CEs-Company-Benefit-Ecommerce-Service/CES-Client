import {
  Box,
  Button,
  Card,
  Container,
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
import { useMemo, useState } from 'react'
import { BenefitData, Params, Role } from 'src/@types/@ces'
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
import RoleBasedGuard from 'src/guards/RoleBasedGuard'
import { useBenefitList } from 'src/hooks/@ces'
import useSettings from 'src/hooks/useSettings'
import useTable, { emptyRows, getComparator } from 'src/hooks/useTable'
import useTabs from 'src/hooks/useTabs'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import BenefitTableRow from 'src/sections/@ces/benefit/BenefitTableRow'
import BenefitTableToolbar from 'src/sections/@ces/benefit/BenefitTableToolbar'
import LoadingTable from 'src/utils/loadingTable'

// ----------------------------------------------------------------------
const FILTER_OPTIONS = ['descending', 'ascending']

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'estimateTotal', label: 'Total Estimate', align: 'left' },
  { id: 'totalReceive', label: 'Total transfer', align: 'left' },
  { id: 'timeFilter', label: 'Date Time transfer', align: 'left' },
  { id: 'endDate', label: 'End Date', align: 'left' },
  { id: 'unitPrice', label: 'Unit Price', align: 'left' },
  { id: 'type', label: 'Type', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  // { id: 'createdAt', label: 'created At', align: 'left' },
  // { id: 'updateAt', label: 'update At', align: 'left' },
  { id: '' },
]
const STATUS_OPTIONS = ['all', 'active', 'in active']

// ----------------------------------------------------------------------

BenefitPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------
export enum Status {
  '',
  'active',
  'in active',
}
export default function BenefitPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    // setPage,
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

  const { themeStretch } = useSettings()
  const [params, setParams] = useState<Partial<Params>>()

  const { data, isLoading } = useBenefitList({ params })
  const projectList: BenefitData[] = data?.data || []

  const [filterName, setFilterName] = useState('')

  const [filterRole, setFilterRole] = useState('all')
  const [timeoutName, setTimeoutName] = useState<any>()
  const [filterAttribute, setFilterAttribute] = useState('')
  const [filterOptions, setFilterOptions] = useState('')
  const handleClearFilter = () => {
    setFilterAttribute('')
    setFilterName('')
    setFilterOptions('')
  }

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all')

  useMemo(() => {
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
  }, [filterAttribute, filterStatus, filterOptions, page, rowsPerPage])
  const handleFilterRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterRole(event.target.value)
  }
  function getStatusIndex(status: string): number {
    return Status[status as keyof typeof Status] || -1
  }
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
  const handleDeleteRow = (id: string) => {
    // confirmDialog('Do you really want to delete this project ?', async () => {
    //   await projectApi.delete(id)
    //   // await remove(id)
    //   // mutate({ ...data, data: [] }, true)
    //   enqueueSnackbar('Delete successful')
    // })
  }

  const handleDeleteRows = (selected: string[]) => {
    // console.log('delete all project action')
  }

  const handleEditRow = (id: string) => {
    push(PATH_CES.benefit.edit(paramCase(id)))
  }
  const handleFilterOptions = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions(event.target.value)
  }
  const handleFilterAttribute = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterAttribute(event.target.value)
  }
  const handleClickRow = (id: string) => {
    // push(PATH_CES.project.detail(paramCase(id)))
    push(PATH_CES.benefit.edit(paramCase(id)))
  }

  const dataFiltered = applySortFilter({
    tableData: projectList,
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
    <RoleBasedGuard hasContent roles={[Role['Enterprise Admin']]}>
      <Page title="Benefit: List">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Benefit List"
            links={[
              { name: 'Dashboard', href: '' },
              { name: 'Benefit', href: '' },
              { name: 'List' },
            ]}
            action={
              <NextLink href={PATH_CES.benefit.new} passHref>
                <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                  New Benefit
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
              {STATUS_OPTIONS.map((tab) => (
                <Tab disableRipple key={tab} label={tab} value={tab} />
              ))}
            </Tabs>

            <BenefitTableToolbar
              filterName={filterName}
              filterRole={filterRole}
              onFilterName={handleFilterName}
              onFilterRole={handleFilterRole}
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
                    rowCount={projectList.length}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        projectList.map((row) => `${row.id}`)
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
                    rowCount={projectList.length}
                    numSelected={selected.length}
                    onSort={onSort}
                    onSelectAllRows={(checked) =>
                      onSelectAllRows(
                        checked,
                        projectList.map((row: any) => `${row.id}`)
                      )
                    }
                  />

                  <TableBody>
                    {dataFiltered.map((row) => (
                      <BenefitTableRow
                        key={`${row.id}`}
                        row={row}
                        selected={selected.includes(`${row.id}`)}
                        onSelectRow={() => onSelectRow(`${row.id}`)}
                        onDeleteRow={() => handleDeleteRow(`${row.id}`)}
                        onEditRow={() => handleEditRow(`${row.id}`)}
                        onClickRow={() => handleClickRow(`${row.id}`)}
                      />
                    ))}

                    <TableEmptyRows
                      height={denseHeight}
                      emptyRows={emptyRows(page, rowsPerPage, projectList.length)}
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
                // onPageChange={(e) => {
                //   onChangePage(e, page)
                // }}
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
  filterStatus,
  filterRole,
}: {
  tableData: BenefitData[]
  comparator: (a: any, b: any) => number
  filterName: string
  filterStatus: string
  filterRole: string
}) {
  return tableData
}
