import NextLink from 'next/link'
import Page from 'src/components/Page'
import Layout from 'src/layouts'
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
import { useRouter } from 'next/router'
import { useState } from 'react'
// import { UserManager } from 'src/@types/user'
// import { _userList } from 'src/_mock'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Iconify from 'src/components/Iconify'
import Scrollbar from 'src/components/Scrollbar'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
} from 'src/components/table'
import useTable, { emptyRows, getComparator } from 'src/hooks/useTable'
import useTabs from 'src/hooks/useTabs'
import { PATH_CES } from 'src/routes/paths'
import AccountTableRow from 'src/sections/@ces/account/AccountTableRow'
import { UserTableToolbar } from 'src/sections/@dashboard/user/list'
import { confirmDialog } from 'src/utils/confirmDialog'
import { RouterGuard, UserRole } from 'src/guards/RouterGuard'
import { type } from 'os'
import CategoryTableRow from 'src/sections/@ces/category/CategoryTableRow'
import { useCategoryList } from 'src/hooks/@ces/useCategory'
import { Category } from 'src/@types/@ces'
import { categoryApi } from 'src/api-client/category'
import { useSnackbar } from 'notistack'
import CategoryTableToolbar from 'src/sections/@ces/category/CategoryTableToolbar'


// ----------------------------------------------------------------------

const STATUS_OPTIONS = ['all']

const ROLE_OPTIONS = ['all']



// const TABLE_HEAD = Object.keys(jsonData).map((key) => ({
//   id: key.toLowerCase(),
//   label: key.charAt(0).toUpperCase() + key.slice(1),
//   align: 'left'
// }));

const TABLE_HEAD = [
  { id: 'Name', label: 'Name', align: 'left' },
  { id: 'Description', label: 'Description', align: 'left' },
  { id: '' },


]

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

CategoryPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function CategoryPage() {
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

  const { data, mutate } = useCategoryList({})

  const tableData: Category[] = data?.data ?? []
  const { enqueueSnackbar } = useSnackbar()

  const [filterName, setFilterName] = useState('')

  const [filterRole, setFilterRole] = useState('all')

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all')

  const handleFilterName = (filterName: string) => {
    setFilterName(filterName)
    setPage(0)
  }

  const handleFilterRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterRole(event.target.value)
  }

  const handleDeleteRow = (id: string) => {
    const cateId = parseInt(id)
    confirmDialog('Do you really want to delete this category ?', async () => {
      try {
        await categoryApi.delete(cateId)
        mutate()
        enqueueSnackbar('Delete successfull')
      } catch (error) {
        enqueueSnackbar('Delete failed')
        console.error(error)
      }
    })
  }

  const handleDeleteRows = (selected: string[]) => {
    // const deleteRows = tableData.filter((row) => !selected.includes(row.id))
    setSelected([])
    console.log('delete all account action')
  }

  const handleEditRow = (id: number) => {
    push(PATH_CES.category.edit(paramCase(id.toString())))
  }

  const dataFiltered = applySortFilter({
    tableData,
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
    // <RouterGuard acceptRoles={[UserRole.EMPLOYEEA]}>
    <Page title="Category: List">
      <Container>
        <HeaderBreadcrumbs
          heading="Category List"
          links={[
            { name: 'Dashboard', href: '' },
            { name: 'Category', href: '' },
            { name: 'List' },
          ]}
          action={
            <NextLink href={PATH_CES.category.new} passHref>
              <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                New Category
              </Button>
            </NextLink>
          }
        />

        <Card>
          <CategoryTableToolbar filterName={filterName} onFilterName={handleFilterName} />

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
                      tableData.map((row) => `${row.id}`)
                    )
                  }
                />

                <TableBody>
                  {dataFiltered
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => (
                      <CategoryTableRow
                        key={`${row.id}`}
                        row={row}
                        selected={selected.includes(`${row.id}`)}
                        onSelectRow={() => onSelectRow(`${row.id}`)}
                        onDeleteRow={() => handleDeleteRow(`${row.id}`)}
                        onEditRow={() => handleEditRow(row.id)}
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
    // </RouterGuard>
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
  tableData: Category[]
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
    tableData = tableData.filter((item: Record<string, any>) => item.Status == filterStatus)
  }

  if (filterRole !== 'all') {
    tableData = tableData.filter((item: Record<string, any>) => item.Role == filterRole)
  }

  return tableData
}
// function enqueueSnackbar(arg0: string) {
//   throw new Error('Function not implemented.')
// }
