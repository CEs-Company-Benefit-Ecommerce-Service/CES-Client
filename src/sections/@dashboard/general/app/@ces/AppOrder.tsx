import {
  Box,
  Button,
  Card,
  CardHeader,
  CardProps,
  Divider,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Order } from 'src/@types/@ces'
import Scrollbar from 'src/components/Scrollbar'
import { PATH_CES } from 'src/routes/paths'
import { fDateVN } from 'src/utils/formatTime'
// components
// import Label from '../../../../../components/Label'
import Iconify from '../../../../../components/Iconify'
// import Scrollbar from '../../../../../components/Scrollbar'
import { TableHeadCustom, TableMoreMenu } from '../../../../../components/table'
// utils
import { fCurrency } from '../../../../../utils/formatNumber'

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string
  subheader?: string
  // tableData: RowProps[]
  tableData: Order[]
  tableLabels: any
}

export default function AppOrder({ title, subheader, tableData, tableLabels, ...other }: Props) {
  const { push } = useRouter()

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <Scrollbar>
        <TableContainer sx={{ minWidth: 720 }}>
          <Table>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row) => (
                <AppNewInvoiceRow key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>
      {tableData.length === 0 && (
        <Box
          height={'400px'}
          sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        >
          <Typography>No order</Typography>
        </Box>
      )}
      <Divider />

      <Box sx={{ p: 2, textAlign: 'right' }}>
        <Button
          size="small"
          color="inherit"
          endIcon={<Iconify icon={'eva:arrow-ios-forward-fill'} />}
          onClick={() => {
            push(PATH_CES.order.root)
          }}
        >
          View All
        </Button>
      </Box>
    </Card>
  )
}

// ----------------------------------------------------------------------

type AppNewInvoiceRowProps = {
  row: Order
}

function AppNewInvoiceRow({ row }: AppNewInvoiceRowProps) {

  const [openMenu, setOpenMenuActions] = useState<HTMLElement | null>(null)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenuActions(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setOpenMenuActions(null)
  }

  const handleDownload = () => {
    handleCloseMenu()
    console.log('DOWNLOAD', row.id)
  }

  const handlePrint = () => {
    handleCloseMenu()
    console.log('PRINT', row.id)
  }

  const handleShare = () => {
    handleCloseMenu()
    console.log('SHARE', row.id)
  }

  const handleDelete = () => {
    handleCloseMenu()
    console.log('DELETE', row.id)
  }

  return (
    <TableRow>
      <TableCell>{`${row.orderCode}`}</TableCell>

      <TableCell>{row.employeeName}</TableCell>

      <TableCell>{fDateVN(row.createdAt)}</TableCell>
      <TableCell>{fCurrency(row.total)}</TableCell>

      {/* <TableCell>
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          color={
            (row.status === 'in_progress' && 'warning') ||
            (row.status === 'out_of_date' && 'error') ||
            'success'
          }
        >
          {sentenceCase(row.status)}
        </Label>
      </TableCell> */}

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem onClick={handleDownload}>
                <Iconify icon={'eva:download-fill'} />
                Download
              </MenuItem>

              <MenuItem onClick={handlePrint}>
                <Iconify icon={'eva:printer-fill'} />
                Print
              </MenuItem>

              <MenuItem onClick={handleShare}>
                <Iconify icon={'eva:share-fill'} />
                Share
              </MenuItem>

              <Divider sx={{ borderStyle: 'dashed' }} />

              <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                <Iconify icon={'eva:trash-2-outline'} />
                Delete
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  )
}
