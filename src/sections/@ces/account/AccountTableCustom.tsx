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
import { capitalCase, paramCase } from 'change-case'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useMemo, useState } from 'react'
import { AccountData, Params } from 'src/@types/@ces'
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
import AccountWallet from './wallet/AccountWallet'

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name', align: 'left' },
  { id: 'email', label: 'Email', align: 'left' },
  { id: '' },
]
const FILTER_OPTIONS = ['descending', 'ascending']

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
  // const statusOptions = ACCOUNT_STATUS_OPTIONS_SA

  const [filterName, setFilterName] = useState('')
  const [timeoutName, setTimeoutName] = useState<any>()
  const [filterAttribute, setFilterAttribute] = useState('')
  const [filterOptions, setFilterOptions] = useState('')
  const [params, setParams] = useState<Partial<Params>>()
  const { data } = useAccountList({ params })
  const accountList: AccountData[] = data?.data ?? []

  // const [filterRole, setFilterRole] = useState('all')

  const { currentTab: filterStatus, onChangeTab: onChangeFilterStatus } = useTabs('all')
  useMemo(
    () =>
      setParams({
        Page: page + 1,
        Size: rowsPerPage,
        Sort: filterAttribute,
        Order: filterOptions,
      }),
    [filterAttribute, filterOptions, page, rowsPerPage]
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
  const handleClearFilter = () => {
    setFilterAttribute('')
    setFilterName('')
    setFilterOptions('')
  }
  // const handleFilterRole = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setFilterRole(event.target.value)
  // }

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
    confirmDialog('Do you really want to add all account to group ?', async () => {
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
    })
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
    // filterRole,
    filterStatus,
  })

  const denseHeight = dense ? 52 : 72

  const isNotFound =
    (!dataFiltered.length && !!filterName) ||
    // (!dataFiltered.length && !!filterRole) ||
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
        {roleOptions.map((tab) => (
          <Tab disableRipple key={tab.code} label={tab.label} value={tab.code} />
        ))}
      </Tabs>

      <Divider />

      <AccountTableToolbar
        filterName={filterName}
        onFilterName={handleFilterName}
        // filterRole={filterRole}
        // onFilterRole={handleFilterRole}
        // optionsRole={roleOptions}
        filterOptions={filterOptions}
        filterAttribute={filterAttribute}
        optionsSort={TABLE_HEAD}
        optionsOrderBy={FILTER_OPTIONS}
        onFilterAttribute={handleFilterAttribute}
        onFilterOptions={handleFilterOptions}
        handleClearFilter={handleClearFilter}
      />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 800, position: 'relative' }}>
          {selected.length > 0 && (
            <TableSelectedActions
              dense={dense}
              numSelected={selected.length}
              rowCount={dataFiltered.length}
              onSelectAllRows={(checked) => {
                onSelectAllRows(
                  checked,
                  dataFiltered.map((row) => `${row.id}`)
                )
              }}
              actions={
                filterStatus === 'all' ? (
                  <>
                    <Tooltip title="Add all">
                      <IconButton color="primary" onClick={() => handleAddRows(selected)}>
                        <Iconify icon={'material-symbols:add'} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove all">
                      <IconButton color="primary" onClick={() => handleRemoveRows(selected)}>
                        <Iconify icon={'material-symbols:remove'} />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : filterStatus === 'member' ? (
                  <Tooltip title="Remove all">
                    <IconButton color="primary" onClick={() => handleRemoveRows(selected)}>
                      <Iconify icon={'material-symbols:remove'} />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="Add all">
                    <IconButton color="primary" onClick={() => handleAddRows(selected)}>
                      <Iconify icon={'material-symbols:add'} />
                    </IconButton>
                  </Tooltip>
                )
              }
            />
          )}

          <Table size={dense ? 'small' : 'medium'}>
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={dataFiltered.length}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  dataFiltered.map((row: any) => `${row.id}`)
                )
              }
            />

            <TableBody>
              {dataFiltered.map((row) => {
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
          count={data?.metaData?.total}
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
  // filterRole,
  projectDetails,
}: {
  projectDetails: any
  tableData: AccountData[]
  comparator: (a: any, b: any) => number
  filterName: string
  filterStatus: string
  // filterRole?: string
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

  // if (filterStatus !== 'all') {
  //   tableData = tableData.filter((item: Record<string, any>) => item.status == filterStatus)
  // }

  const filterIds = projectDetails?.employeeGroupMappings?.map((obj: any) => obj.employee.accountId)

  if (filterStatus !== 'all') {
    const filterFunc =
      filterStatus === 'member'
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
  const { currentTab, onChangeTab } = useTabs('general')

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: <AccountNewEditForm currentUser={account} isDetail />,
    },
    {
      value: 'wallet',
      icon: <Iconify icon={'ic:round-receipt'} width={20} height={20} />,
      component: <AccountWallet accountId={`${account?.id}`} />,
    },
  ]

  return (
    <Dialog fullWidth maxWidth="lg" open onClose={handleClose}>
      <DialogTitle>Employee Details</DialogTitle>

      <DialogContent sx={{ mt: 1 }}>
        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={currentTab}
          onChange={onChangeTab}
        >
          {ACCOUNT_TABS.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              label={capitalCase(tab.value)}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {!account ? (
          <>Loading...</>
        ) : (
          ACCOUNT_TABS.map((tab) => {
            const isMatched = tab.value === currentTab
            return isMatched && <Box key={tab.value}>{tab.component}</Box>
          })
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  )
}
