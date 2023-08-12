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
  Table,
  TableBody,
  TableContainer,
  TablePagination,
  Tooltip
} from '@mui/material'
import { paramCase } from 'change-case'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useMemo, useState } from 'react'
import { Params, Role } from 'src/@types/@ces'
import { ProjectData } from 'src/@types/@ces/project'
import { projectApi } from 'src/api-client'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Iconify from 'src/components/Iconify'
import Page from 'src/components/Page'
import Scrollbar from 'src/components/Scrollbar'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions
} from 'src/components/table'
import RoleBasedGuard from 'src/guards/RoleBasedGuard'
import { useProjectList } from 'src/hooks/@ces'
import useSettings from 'src/hooks/useSettings'
import useTable, { emptyRows, getComparator } from 'src/hooks/useTable'
import useTabs from 'src/hooks/useTabs'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import ProjectTableRow from 'src/sections/@ces/project/ProjectTableRow'
import ProjectTableToolbar from 'src/sections/@ces/project/ProjectTableToolbar'
import { confirmDialog } from 'src/utils/confirmDialog'
import LoadingTable from 'src/utils/loadingTable'

// ----------------------------------------------------------------------
const FILTER_OPTIONS = ['descending', 'ascending']

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'status', label: 'Status', align: 'left' },
  { id: 'createdAt', label: 'created At', align: 'left' },
  { id: 'updatedAt', label: 'updated At', align: 'left' },
  { id: '' },
]

// ----------------------------------------------------------------------

ProjectPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function ProjectPage() {
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
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

  const { enqueueSnackbar } = useSnackbar()
  const [params, setParams] = useState<Partial<Params>>()

  const { data, isLoading } = useProjectList({ params })
  const projectList: ProjectData[] = data?.data || []

  const [filterName, setFilterName] = useState('')

  const [filterRole, setFilterRole] = useState('all')
  const [timeoutName, setTimeoutName] = useState<any>()
  const [filterAttribute, setFilterAttribute] = useState('')
  const [filterOptions, setFilterOptions] = useState('')
  const { currentTab: filterStatus } = useTabs('all')
  useMemo(
    () =>
      setParams({
        Page: page + 1,
        Size: rowsPerPage,
        Sort: filterAttribute == '' ? 'createdAt' : filterAttribute,
        Order: filterOptions == '' ? 'desc' : filterOptions,
      }),
    [filterAttribute, filterOptions, page, rowsPerPage]
  )
  const handleClearFilter = () => {
    setFilterAttribute('')
    setFilterName('')
    setFilterOptions('')
  }
  const handleFilterRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterRole(event.target.value)
  }

  const handleDeleteRow = (id: string) => {
    confirmDialog('Do you really want to delete this project ?', async () => {
      await projectApi.delete(id)
      // await remove(id)
      // mutate({ ...data, data: [] }, true)
      enqueueSnackbar('Delete successful')
    })
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
  const handleFilterOptions = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterOptions(event.target.value)
  }
  const handleFilterAttribute = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFilterAttribute(event.target.value)
  }

  const handleDeleteRows = (selected: string[]) => {
    console.log('delete all project action')
  }

  const handleEditRow = (id: string) => {
    push(PATH_CES.project.detail(paramCase(id)))
  }

  const handleClickRow = (id: string) => {
    push(PATH_CES.project.detail(paramCase(id)))
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
      <Page title="Group Benefit: List">
        <Container maxWidth={themeStretch ? false : 'lg'}>
          <HeaderBreadcrumbs
            heading="Group Benefit List"
            links={[
              { name: 'Dashboard', href: '' },
              { name: 'Group Benefit', href: '' },
              { name: 'List' },
            ]}
            action={
              <NextLink href={PATH_CES.benefit.new} passHref>
                <Button variant="contained" startIcon={<Iconify icon={'eva:plus-fill'} />}>
                  New Group Benefit
                </Button>
              </NextLink>
            }
          />

          <Card>
            {/* <Tabs
              allowScrollButtonsMobile
              variant="scrollable"
              scrollButtons="auto"
              value={filterStatus}
              onChange={onChangeFilterStatus}
              sx={{ px: 2, bgcolor: 'background.neutral' }}
            >
              {statusList.map((tab) => (
                <Tab disableRipple key={tab.code} label={tab.label} value={tab.code} />
              ))}
            </Tabs> */}

            <ProjectTableToolbar
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
              // optionsRole={ROLE_OPTIONS}
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

                  <Divider />
                  <TableBody>
                    {dataFiltered.map((row) => (
                      <ProjectTableRow
                        key={`${row.id}`}
                        row={row}
                        isValidating={isLoading}
                        selected={selected.includes(`${row.id}`)}
                        onSelectRow={() => onSelectRow(`${row.id}`)}
                        onDeleteRow={() => handleDeleteRow(`${row.id}`)}
                        onEditRow={() => handleEditRow(row.id)}
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
  tableData: ProjectData[]
  comparator: (a: any, b: any) => number
  filterName: string
  filterStatus: string
  filterRole: string
}) {
  return tableData
}
