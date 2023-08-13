// @mui
import { LoadingButton } from '@mui/lab'
import {
  Box,
  Card,
  Divider,
  Grid, Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, Typography
} from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { Debt, TransactionUpdatePayload } from 'src/@types/@ces'
import { DebtStatus } from 'src/@types/@ces/debt'
import Image from 'src/components/Image'
import { useCompanyDetails } from 'src/hooks/@ces'
import useAuth from 'src/hooks/useAuth'
import { fCurrency } from 'src/utils/formatNumber'
import { fDateVN } from 'src/utils/formatTime'
// utils
// components
import Label from '../../../../components/Label'
import Scrollbar from '../../../../components/Scrollbar'

// ----------------------------------------------------------------------

const RowResultStyle = styled(TableRow)(({ theme }) => ({
  '& td': {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}))

// ----------------------------------------------------------------------

type Props = {
  debt?: Debt
  compId?: string
  mutate?: any
  handleUpdateDebt: (id: string, payload: TransactionUpdatePayload) => void
}

export default function DebtDetails({ debt, compId, handleUpdateDebt }: Props) {
  const theme = useTheme()
  const [loading, setLoading] = useState(false)
  const { data: company } = useCompanyDetails({ id: `${compId}` })
  const { user } = useAuth()
  if (!debt) {
    return null
  }
  const rs = Object.values(DebtStatus)

  const { id, total, status, imageUrl, createdAt } = debt
  const handleUpdate = async (status: number) => {
    const payload: TransactionUpdatePayload = { status: status, imageUrl: imageUrl }
    setLoading(true)
    await handleUpdateDebt(id, payload)
    setLoading(false)
  }
  return (
    <>
      <Card sx={{ pt: 2, px: 2 }}>
        <Grid container>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            <Box sx={{ textAlign: { sm: 'left' } }}>
              <Label
                variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
                color={(status === 3 && 'info') || (status === 2 && 'error') || 'success'}
                sx={{ textTransform: 'uppercase', mb: 1 }}
              >
                {rs[status]}
              </Label>
              <Typography variant="h6">{`DBT-${id}`}</Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} sx={{ mb: 5 }}>
            {user?.role == 3 ? null : (
              <Stack
                justifyContent="flex-end"
                direction="row"
                sx={{ textAlign: { sm: 'right' } }}
                spacing={2}
              >
                <LoadingButton
                  loading={loading}
                  variant="contained"
                  size="large"
                  color={'error'}
                  disabled={status != 3}
                  onClick={() => handleUpdate(2)}
                >
                  Cancel
                </LoadingButton>

                <LoadingButton
                  loading={loading}
                  variant="contained"
                  color={'primary'}
                  disabled={status != 3}
                  size="large"
                  onClick={() => handleUpdate(1)}
                >
                  Complete
                </LoadingButton>
              </Stack>
            )}
          </Grid>
          <Grid item xs={12} sm={0.5} sx={{ mb: 5 }}>
            {}
          </Grid>
          <Grid item xs={12} sm={3} sx={{ mb: 5 }}>
            <Image src={imageUrl} alt="banking image" width={300} height={400} />
          </Grid>
          <Grid item xs={12} sm={0.5} sx={{ mb: 5 }}>
            {}
          </Grid>
          <Grid item xs={12} sm={7.5} sx={{ mb: 5 }}>
            <Box sx={{ pl: 3 }}>
              {' '}
              <Typography variant="h6"> Details</Typography>
            </Box>
            <Scrollbar>
              <TableContainer sx={{ minWidth: 50 }}>
                <Table>
                  <TableHead
                    sx={{
                      borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                      '& th': { backgroundColor: 'transparent' },
                    }}
                  >
                    <TableRow>
                      <TableCell align="left">Company</TableCell>
                      <TableCell align="left">Created At</TableCell>
                      <TableCell align="left">Used</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow
                      sx={{
                        borderBottom: (theme) => `solid 1px ${theme.palette.divider}`,
                      }}
                    >
                      <TableCell align="left">{company?.data?.name}</TableCell>
                      <TableCell align="left">{fDateVN(createdAt)}</TableCell>
                      <TableCell align="left">{company?.data?.used}</TableCell>
                      <TableCell align="right">{fCurrency(total)}</TableCell>
                    </TableRow>

                    <RowResultStyle>
                      <TableCell colSpan={2} />
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
                      <TableCell colSpan={2} />
                      <TableCell align="right">
                        <Typography variant="h6">Total</Typography>
                      </TableCell>
                      <TableCell align="right" width={80}>
                        <Typography variant="h6">{fCurrency(total)}</Typography>
                      </TableCell>
                    </RowResultStyle>
                  </TableBody>
                </Table>
              </TableContainer>
            </Scrollbar>
          </Grid>
          <Grid item xs={12} sm={0.5} sx={{ mb: 5 }}>
            {}
          </Grid>
        </Grid>

        <Divider sx={{ mt: 5 }} />
      </Card>
    </>
  )
}
