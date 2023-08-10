// @mui
import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import { toNumber } from 'lodash'
import { useState } from 'react'
//
import { Order, Status, UpdateOrderStatus } from 'src/@types/@ces/order'
import { fCurrency } from 'src/utils/formatNumber'
import { fDateVN } from 'src/utils/formatTime'
// utils
// components
import Label from '../../../../components/Label'
import Scrollbar from '../../../../components/Scrollbar'
import { LoadingButton } from '@mui/lab'

// ----------------------------------------------------------------------

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}))

// ----------------------------------------------------------------------

type Props = {
  order?: Order
  handleEditOrderSubmit: (id: string, status: number) => void
}

export default function OrderDetails({ order, handleEditOrderSubmit }: Props) {
  const theme = useTheme()

  const [loading, setLoading] = useState(false)
  const [changeStatus, setChangeStatus] = useState(false)
  const [statusValue, setStatusValue] = useState<number>()
  // const { query, push } = useRouter()
  if (!order) {
    return null
  }
  const rs = Object.values(Status).filter((value) => typeof value === 'string')
  const rsu = Object.values(UpdateOrderStatus).filter((value) => typeof value === 'string')

  const { id, orderCode, total, updatedAt, createdAt, status, employee, orderDetails } = order

  const handleUpdateStatus = () => {
    setChangeStatus(!changeStatus)
  }
  const handleUpdate = async () => {
    setLoading(true)
    await handleEditOrderSubmit(id, status + 1)
    setLoading(false)
    // setChangeStatus(!changeStatus)
  }

  return (
    <>
      <Card sx={{ pt: 5, px: 5 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Box sx={{ textAlign: { sm: 'left' } }}>
              {!changeStatus ? (
                <Label
                  variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                  color={
                    (status === 1 && 'primary') ||
                    (status === 2 && 'warning') ||
                    (status === 3 && 'info') ||
                    (status === 4 && 'success') ||
                    (status === 5 && 'error') ||
                    'default'
                  }
                  sx={{ textTransform: 'uppercase', mb: 1 }}
                >
                  {rs[status]}
                </Label>
              ) : (
                <TextField
                  fullWidth
                  select
                  label="Status"
                  defaultValue={status}
                  // value={status}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setStatusValue(toNumber(e.target.value))
                  }
                  SelectProps={{
                    MenuProps: {
                      sx: { '& .MuiPaper-root': { maxHeight: 260 } },
                    },
                  }}
                  sx={{
                    maxWidth: { sm: 240 },
                    textTransform: 'capitalize',
                  }}
                >
                  {rsu.map((value, index) => (
                    <MenuItem
                      key={index}
                      value={index}
                      sx={{
                        mx: 1,
                        my: 0.5,
                        borderRadius: 0.75,
                        typography: 'body2',
                        textTransform: 'capitalize',
                      }}
                    >
                      {value}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              <Typography variant="h6">{orderCode}</Typography>
              {/* <Typography variant="h6">{`INV-${id}`}</Typography> */}
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Stack
              justifyContent="flex-end"
              direction="row"
              sx={{ textAlign: { sm: 'right' } }}
              spacing={2}
            >
              {changeStatus ? (
                <Button variant="contained" size="large" onClick={handleUpdate}>
                  Save
                </Button>
              ) : (
                ''
              )}

              <LoadingButton
                loading={loading}
                variant="contained"
                color={changeStatus ? 'inherit' : 'primary'}
                disabled={rsu[status] === undefined ? true : false}
                size="large"
                onClick={handleUpdate}
              >
                {status == 1 ? 'Ready' : status == 2 ? 'Shipping' : 'Update'}
              </LoadingButton>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Customer Information
            </Typography>
            <Typography variant="body2">Name: {employee?.account.name}</Typography>
            <Typography variant="body2">Address: {employee?.account.address}</Typography>
            <Typography variant="body2">Email: {employee?.account.email}</Typography>
            <Typography variant="body2">Phone: {employee?.account.phone}</Typography>
          </Grid>

          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Date create
            </Typography>
            <Typography variant="body2">{fDateVN(createdAt!)}</Typography>
            <Typography paragraph variant="overline" sx={{ color: 'text.disabled' }}>
              Date update
            </Typography>
            <Typography variant="body2">{fDateVN(updatedAt!)}</Typography>
          </Grid>
        </Grid>

        <Scrollbar>
          <TableContainer sx={{ minWidth: 960 }}>
            <Table>
              <TableHead
                sx={{
                  borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                  '& th': { backgroundColor: 'transparent' },
                }}
              >
                <TableRow>
                  <TableCell width={40}>#</TableCell>
                  <TableCell align="left">Product</TableCell>
                  <TableCell align="left">Qty</TableCell>
                  <TableCell align="right">Unit price</TableCell>
                  <TableCell align="right">Total</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {orderDetails?.map((row: any, index: any) => (
                  <TableRow
                    key={index}
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                    }}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell align="left">
                      <Box sx={{ maxWidth: 560 }}>
                        <Typography variant="subtitle2">{row?.product?.name}</Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                          {row?.product?.notes}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell align="left">{row?.quantity}</TableCell>
                    <TableCell align="right">{fCurrency(row?.product?.price)}</TableCell>
                    <TableCell align="right">{fCurrency(row.price)}</TableCell>
                  </TableRow>
                ))}

                <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Box sx={{ mt: 2 }} />
                    <Typography>Subtotal</Typography>
                  </TableCell>
                  <TableCell align="right" width={120}>
                    <Box sx={{ mt: 2 }} />
                    <Typography>{fCurrency(total)}</Typography>
                  </TableCell>
                </RowResultStyle>

                <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Typography>Discount</Typography>
                  </TableCell>
                  <TableCell align="right" width={120}>
                    <Typography sx={{ color: 'error.main' }}>
                      {/* {discount && fCurrency(-discount)} */}Nah
                    </Typography>
                  </TableCell>
                </RowResultStyle>
                <RowResultStyle>
                  <TableCell colSpan={3} />
                  <TableCell align="right">
                    <Typography variant="h6">Total</Typography>
                  </TableCell>
                  <TableCell align="right" width={140}>
                    <Typography variant="h6">{fCurrency(total)}</Typography>
                  </TableCell>
                </RowResultStyle>
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Divider sx={{ mt: 5 }} />
      </Card>
    </>
  )
}
