// @mui
import {
  Box,
  Button,
  Card,
  Container,
  FormControlLabel,
  IconButton,
  LinearProgress,
  Switch,
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tooltip,
} from '@mui/material'
import { paramCase } from 'change-case'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Params, Role } from 'src/@types/@ces'
import { Product } from 'src/@types/@ces/product'
import { productApi } from 'src/api-client/product'
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
import { useProduct } from 'src/hooks/@ces/useProduct'
import useTable, { emptyRows, getComparator } from 'src/hooks/useTable'
import useTabs from 'src/hooks/useTabs'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import ProductTableRow from 'src/sections/@ces/product/ProductTableRow'
import ProductTableToolbar from 'src/sections/@ces/product/ProductTableToolbar'
import { confirmDialog } from 'src/utils/confirmDialog'
import LoadingTable from 'src/utils/loadingTable'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'description', label: 'Description', align: 'left' },
  { id: 'price', label: 'Price', align: 'left' },
  { id: 'quantity', label: 'Quantity', align: 'left' },
  { id: 'category.name', label: 'Category', align: 'left' },
  { id: '' },
]
ProductPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function ProductPage() {
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
  const [filterName, setFilterName] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [params, setParams] = useState<Partial<Params>>()
  const { data, mutate, isLoading, isValidating } = useProduct({ params })
  const tableData: Product[] = data?.data ?? []
  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all')
  const { enqueueSnackbar } = useSnackbar()
  const handleFilterName = (filterName: string) => {
    setFilterName(filterName)
    // setPage(0)
  }
  useMemo(() => setParams({ Page: page + 1, Size: rowsPerPage }), [page, rowsPerPage])

  console.log(rowsPerPage)

  // const handleFilterRole = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setFilterRole(event.target.value)
  // }

  const handleDeleteRow = (id: string) => {
    confirmDialog('Do you really want to delete this product ?', async () => {
      try {
        await productApi.delete(id)
        mutate()
        enqueueSnackbar('Delete successfull')
      } catch (error) {
        enqueueSnackbar('Delete failed')
        console.error(error)
      }
    })
  }
  // if (isLoading) {
  //   return <LoadingScreen />
  // }
  const handleDeleteRows = (selected: string[]) => {
    // const deleteRows = tableData.filter((row) => !selected.includes(row.id))
    setSelected([])
    console.log('delete all account action')
  }

  const handleEditRow = (id: string) => {
    push(PATH_CES.product.edit(paramCase(id)))
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
    <RoleBasedGuard hasContent roles={[Role['Supplier Admin']]}>
      <Page title="Product: List">
        <Container>
          <HeaderBreadcrumbs
            heading="Product List"
            links={[
              { name: 'Dashboard', href: '' },
              { name: 'Product', href: '' },
              { name: 'List' },
            ]}
            action={
              <NextLink href={PATH_CES.product.new} passHref>
                <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                  New Product
                </Button>
              </NextLink>
            }
          />
          <Card>
            <ProductTableToolbar filterName={filterName} onFilterName={handleFilterName} />
            <LoadingTable isValidating={isValidating} />
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
                      // .slice(page * 0, dataFiltered.length)
                      .map((row) => (
                        <ProductTableRow
                          key={`${row.id}`}
                          row={row}
                          isValidating={isValidating}
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
                rowsPerPageOptions={[5, 10]}
                component="div"
                count={data?.metaData?.total}
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
  filterStatus,
  filterRole,
}: {
  tableData: Product[]
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
        item?.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
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
