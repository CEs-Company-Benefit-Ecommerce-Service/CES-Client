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
  Tooltip,
} from '@mui/material'
import { paramCase } from 'change-case'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useMemo, useState } from 'react'
import { Category, Params, Role } from 'src/@types/@ces'
import { ProductData } from 'src/@types/@ces/product'
import { productApi } from 'src/api-client/product'
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
import { useCategoryList } from 'src/hooks/@ces'
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
const FILTER_OPTIONS = ['descending', 'ascending']
const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'price', label: 'Price', align: 'left' },
  { id: 'quantity', label: 'Quantity', align: 'left' },
  { id: 'category.name', label: 'Category', align: 'left' },
  { id: 'statuss', label: 'Status', align: 'left' },
  { id: 'createdat', label: 'Created At', align: 'left' },
  { id: 'updatedat', label: 'Updated At', align: 'left' },
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
  const [timeoutName, setTimeoutName] = useState<any>()
  const [filterAttribute, setFilterAttribute] = useState('')
  const [filterOptions, setFilterOptions] = useState('')
  const [filterCate, setFilterCate] = useState<string>('')

  const [params, setParams] = useState<Partial<Params>>()

  const { data, mutate, isLoading } = useProduct({ params })
  const { data: cate } = useCategoryList({})
  const categories: Category[] = cate?.data ?? []
  const tableData: ProductData[] = data?.data ?? []

  const { currentTab: filterStatus } = useTabs('all')

  const { enqueueSnackbar } = useSnackbar()

  useMemo(
    () =>
      setParams({
        Page: page + 1,
        Size: rowsPerPage,
        Sort: filterAttribute == '' ? 'createdAt' : filterAttribute,
        Order: filterOptions == '' ? 'desc' : filterOptions,
        CategoryId: filterCate,
      }),
    [filterAttribute, filterOptions, page, rowsPerPage, filterCate]
  )

  const filterNameFuction = (value: string) => {
    setParams({ Page: page + 1, Size: rowsPerPage, Name: value })
  }
  const handleFilterOptions = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions(event.target.value)
  }
  const handleFilterAttribute = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterAttribute(event.target.value)
  }
  const handleFilterCate = (value: string | null) => {
    setFilterCate(value!)
  }

  const handleClearFilter = () => {
    setFilterAttribute('')
    setFilterName('')
    setFilterOptions('')
    setFilterCate('')
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
  const handleClickRow = (id: string) => {
    push(PATH_CES.product.edit(paramCase(id)))
  }

  //1 func: nhận 1 biến nếu timeout true thì clear nó

  const handleDeleteRow = (id: string) => {
    confirmDialog('Do you really want to delete this product?', async () => {
      try {
        await productApi.delete(id)
        mutate()
        enqueueSnackbar('Delete successfull')
      } catch (error) {
        enqueueSnackbar('Delete failed', { variant: 'error' })
        console.error(error)
      }
    })
  }

  const handleDeleteRows = (selected: string[]) => {
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

    filterStatus,
  })

  const denseHeight = dense ? 52 : 72

  const isNotFound =
    (!dataFiltered.length && !!filterOptions) ||
    (!dataFiltered.length && !!filterStatus) ||
    (!dataFiltered.length && !!filterAttribute)
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
            <ProductTableToolbar
              filterName={filterName}
              onFilterName={handleFilterName}
              filterOptions={filterOptions}
              filterAttribute={filterAttribute}
              optionsSort={TABLE_HEAD}
              optionsOrderBy={FILTER_OPTIONS}
              onFilterAttribute={handleFilterAttribute}
              onFilterOptions={handleFilterOptions}
              handleClearFilter={handleClearFilter}
              cate={categories}
              handleFilterCate={handleFilterCate}
              filterCate={filterCate}
            />
            <LoadingTable isValidating={isLoading} />
            <Scrollbar>
              <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
                {selected.length > 0 && (
                  <TableSelectedActions
                    dense={dense}
                    numSelected={selected.length}
                    rowCount={data?.metaData?.total}
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
                    rowCount={data?.metaData?.total}
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
                    {isLoading
                      ? Array.from(Array(rowsPerPage)).map((e) => (
                          <TableSkeleton sx={{ height: denseHeight, px: dense ? 1 : 0 }} key={e} />
                        ))
                      : dataFiltered.map((row) => (
                          <ProductTableRow
                            key={`${row.id}`}
                            row={row}
                            isValidating={isLoading}
                            selected={selected.includes(`${row.id}`)}
                            onSelectRow={() => onSelectRow(`${row.id}`)}
                            onDeleteRow={() => handleDeleteRow(`${row.id}`)}
                            onClickRow={() => handleClickRow(`${row.id}`)}
                            onEditRow={() => handleEditRow(row.id)}
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
  filterStatus,
}: {
  tableData: ProductData[]
  comparator: (a: any, b: any) => number
  filterName: string
  filterStatus: string
}) {
  return tableData
}
