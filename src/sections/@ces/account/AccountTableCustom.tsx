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
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { ACCOUNT_STATUS_OPTIONS_SA, AccountData } from 'src/@types/@ces'
import { projectApi } from 'src/api-client'
import Iconify from 'src/components/Iconify'
import Scrollbar from 'src/components/Scrollbar'
import {
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedActions,
} from 'src/components/table'
import { useAccountDetails, useAccountList, useProjectDetails } from 'src/hooks/@ces'
import useTable, { emptyRows, getComparator } from 'src/hooks/useTable'
import useTabs from 'src/hooks/useTabs'
import { PATH_CES } from 'src/routes/paths'
import { confirmDialog } from 'src/utils/confirmDialog'
import AccountNewEditForm from './AccountNewEditForm'
import AccountTableRowCustom from './AccountTableRowCustom'
import AccountTableToolbar from './AccountTableToolbar'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: '' },
]

// ----------------------------------------------------------------------

type Props = {
  any?: any
}
export default function AccountTableCustom({}: Props) {
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

  const { push, query } = useRouter()
  const { projectId } = query

  const { enqueueSnackbar } = useSnackbar()

  const { data: currentProject, mutate: mutateProject } = useProjectDetails({ id: `${projectId}` })
  const projectDetails = currentProject?.data

  // const roleOptions = user?.roleId === Role['System Admin'] ? ROLE_OPTIONS_SA : undefined
  const roleOptions = [
    { code: 'all', label: 'All' },
    { code: 'member', label: 'Member' },
    { code: 'free', label: 'Free' },
  ]
  const statusOptions = ACCOUNT_STATUS_OPTIONS_SA

  const { data } = useAccountList({})
  const accountList: AccountData[] = data?.data ?? []

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
    confirmDialog('Do you really want to remove this account from group ?', async () => {
      try {
        await projectApi.removeMember({
          groupId: `${projectId}`,
          accountId: [id],
        })
        mutateProject()

        enqueueSnackbar('Remove successful')
      } catch (error) {
        console.error(error)
      }
    })
  }

  const handleAddRows = async (selected: string[]) => {
    try {
      await projectApi.addMember({
        groupId: `${projectId}`,
        accountId: [...selected],
      })
      mutateProject()
      setSelected([])
      enqueueSnackbar('Add successful')
    } catch (error) {
      console.error(error)
    }
  }
  const handleRemoveRows = (selected: string[]) => {
    confirmDialog('Do you really want to remove all account from group ?', async () => {
      try {
        await projectApi.removeMember({
          groupId: `${projectId}`,
          accountId: [...selected],
        })
        mutateProject()
        setSelected([])
        enqueueSnackbar('Remove successful')
      } catch (error) {
        console.error(error)
      }
    })
  }

  const handleEditRow = (id: string) => {
    push(PATH_CES.account.edit(paramCase(id)))
  }

  const handleClickRow = (id: string) => {
    setAccountId(id)
    handleClickOpen()
  }

  const handleAddMemberRow = async (id: string) => {
    try {
      await projectApi.addMember({
        groupId: `${projectId}`,
        accountId: [id],
      })
      mutateProject()

      enqueueSnackbar('Add successful')
    } catch (error) {
      console.error(error)
    }
  }

  const dataFiltered = applySortFilter({
    projectDetails,
    tableData: accountList,
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

  const [open, setOpen] = useState(false)
  const [accountId, setAccountId] = useState('')

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Card>
      {open && <AccountDetails handleClose={handleClose} id={accountId} />}
      <Tabs
        allowScrollButtonsMobile
        variant="scrollable"
        scrollButtons="auto"
        value={filterStatus}
        onChange={onChangeFilterStatus}
        sx={{ px: 2, bgcolor: 'background.neutral' }}
      >
        {statusOptions.map((tab) => (
          <Tab disableRipple key={tab.code} label={tab.label} value={tab.code} />
        ))}
      </Tabs>

      <Divider />

      <AccountTableToolbar
        filterName={filterName}
        filterRole={filterRole}
        onFilterName={handleFilterName}
        onFilterRole={handleFilterRole}
        optionsRole={roleOptions}
      />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
          {selected.length > 0 && (
            <TableSelectedActions
              dense={dense}
              numSelected={selected.length}
              rowCount={accountList.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  accountList.map((row) => `${row.id}`)
                )
              }
              actions={
                <>
                  <Tooltip title="Add All">
                    <IconButton color="primary" onClick={() => handleAddRows(selected)}>
                      <Iconify icon={'material-symbols:add'} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Remove All">
                    <IconButton color="primary" onClick={() => handleRemoveRows(selected)}>
                      <Iconify icon={'material-symbols:remove'} />
                    </IconButton>
                  </Tooltip>
                </>
              }
            />
          )}

          <Table size={dense ? 'small' : 'medium'}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={accountList.length}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  accountList.map((row: any) => `${row.id}`)
                )
              }
            />

            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  console.log(row.id)
                  console.log(projectDetails?.employeeGroupMappings)
                  const isMember = projectDetails?.employeeGroupMappings?.some(
                    (e) => e.employee.accountId == row.id
                  )

                  return (
                    <AccountTableRowCustom
                      isMember={isMember}
                      onAddMemberRow={handleAddMemberRow}
                      key={`${row.id}`}
                      row={row}
                      selected={selected.includes(`${row.id}`)}
                      onSelectRow={() => onSelectRow(`${row.id}`)}
                      onDeleteRow={() => handleDeleteRow(`${row.id}`)}
                      onEditRow={() => handleEditRow(row.id)}
                      onClickRow={() => handleClickRow(`${row.id}`)}
                    />
                  )
                })}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(page, rowsPerPage, accountList.length)}
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
          // onPageChange={(e, newPage) => {
          //   onChangePage(e, newPage)
          // }}
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
  filterName,
  filterStatus,
  filterRole,
  projectDetails,
}: {
  projectDetails: any
  tableData: AccountData[]
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
    tableData = tableData.filter((item: Record<string, any>) => item.status == filterStatus)
  }

  const filterIds = projectDetails?.employeeGroupMappings?.map((obj: any) => obj.employee.accountId)

  if (filterRole !== 'all') {
    const filterFunc =
      filterRole === 'member'
        ? (employee: any) => filterIds.includes(employee.id)
        : (employee: any) => !filterIds.includes(employee.id)

    tableData = tableData.filter(filterFunc)
  }

  return tableData
}

// ----------------------------------------------------------------

type AccountDetailsProps = {
  id: string
  handleClose: any
}

function AccountDetails({ handleClose, id }: AccountDetailsProps) {
  const { data } = useAccountDetails({ id: id })
  const account = data?.data

  return (
    <Dialog fullWidth maxWidth="lg" open onClose={handleClose}>
      <DialogTitle>Employee Details</DialogTitle>

      <DialogContent>
        {account ? <AccountNewEditForm isEdit currentUser={account} /> : <div>Loading...</div>}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
