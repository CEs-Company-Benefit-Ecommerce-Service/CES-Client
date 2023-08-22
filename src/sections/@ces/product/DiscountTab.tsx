import { Box, Button, Card, Dialog, Stack, Typography, useTheme } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { ProductData } from 'src/@types/@ces'
import { useDiscount } from 'src/hooks/@ces'

// ----------------------------------------------------------------------

type Props = {
  productId: string
  currentUser: ProductData
  mutateProductDetails?: any
}

export default function DiscountTab({ currentUser, productId, mutateProductDetails }: Props) {
  const { data, isLoading, mutate } = useDiscount({ productId })
  const [loading, setLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar()
  const [open, setOpen] = useState(false)
  function handleClose() {
    setOpen(false)
  }
  function handleClickCreateNewDiscount() {
    setOpen(true)
  }

  return (
    <>
      {!isLoading && (
        <Button variant="contained" sx={{ mb: 2 }} onClick={handleClickCreateNewDiscount}>
          Create new discount
        </Button>
      )}
      {isLoading ? (
        <Typography>Loading...</Typography>
      ) : !!data?.metaData.total ? (
        <DiscountNewEditForm
          loading={loading}
          product={currentUser}
          productId={productId}
          currentUser={data?.data?.[0]}
          isEdit
          onSubmit={async (payload) => {
            confirmDialog('Are you sure to remove this discount', async () => {
              try {
                setLoading(true)
                if (data.data?.[0].id) {
                  await discountApi.delete(`${data.data[0].id}`)
                }
                mutate()
                mutateProductDetails()
                enqueueSnackbar('Update success!')
              } catch (error) {
                enqueueSnackbar(`${error.response.data.Message}`, { variant: 'error' })
                console.error(error)
              } finally {
                setLoading(false)
              }
            })
          }}
        />
      ) : (
        <Typography ml={1} mt={2}>
          No available discount
        </Typography>
      )}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DiscountNewEditForm
          loading={loading}
          product={currentUser}
          productId={productId}
          onSubmit={async (payload) => {
            confirmDialog(
              'Create new discount will in active current discount. Are you sure',
              async () => {
                try {
                  setLoading(true)
                  if (data?.data?.[0]?.id) {
                    await discountApi.delete(`${data.data[0].id}`)
                  }
                  await discountApi.create(payload)
                  mutate()
                  mutateProductDetails()

                  handleClose()
                  enqueueSnackbar('Update success!')
                } catch (error) {
                  enqueueSnackbar(`${error.response?.data.Message}`, { variant: 'error' })
                  console.error(error)
                } finally {
                  setLoading(false)
                }
              }
            )
          }}
        />
      </Dialog>
    </>
  )
}

// ----------------------------------------------------------------------
import { yupResolver } from '@hookform/resolvers/yup'
// @mui
import { LoadingButton } from '@mui/lab'
// next
import { useEffect, useMemo, useState } from 'react'
// form
import { Controller, useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { FormProvider, RHFTextField } from '../../../components/hook-form'
// routes
// utils

import { useSnackbar } from 'notistack'
import { DiscountData, DiscountPayload } from 'src/@types/@ces/discount'
import { discountApi } from 'src/api-client'
import Iconify from 'src/components/Iconify'
import { confirmDialog } from 'src/utils/confirmDialog'
import { fCurrency } from 'src/utils/formatNumber'
import { fDateParam } from 'src/utils/formatTime'

// ----------------------------------------------------------------------

type DiscountNewEditFormProps = {
  isEdit?: boolean
  currentUser?: DiscountData
  onSubmit?: (payload: DiscountPayload) => void
  productId: string
  product: ProductData
  loading?: boolean
}

function DiscountNewEditForm({
  isEdit = false,
  currentUser,
  onSubmit,
  productId,
  product,
  loading,
}: DiscountNewEditFormProps) {
  const theme = useTheme()
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const [price, setPrice] = useState(isEdit ? product.price : product.preDiscount || product.price)

  useEffect(() => {
    setPrice(isEdit ? product.price : product.preDiscount || product.price)
  }, [product, isEdit])

  const NewUserSchema = Yup.object().shape({
    amount: Yup.number()
      .required('Amount is required')
      .min(5000)
      .max(product.preDiscount || product.price),
    expiredDate: Yup.date().required('Expired Date is required'),
  })

  const defaultValues = useMemo(
    () => ({
      amount: currentUser?.amount || 0,
      expiredDate: new Date(currentUser?.expiredDate || ''),
      productId: productId,
      type: 1,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  )

  const methods = useForm<DiscountPayload>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  })

  const {
    reset,
    control,
    // setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues)
    }
    if (!isEdit) {
      reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser])

  const handleFormSubmit = async (payload: DiscountPayload) => {
    if (payload.expiredDate) {
      const parseDateParam = fDateParam(payload.expiredDate)
      payload.expiredDate = parseDateParam
    }
    await onSubmit?.(payload)
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleFormSubmit)}>
      <Card sx={{ p: 3 }}>
        {isEdit ? (
          <Typography variant="h5">Current discount</Typography>
        ) : (
          <>
            <Stack
              direction={'row'}
              alignItems={'center'}
              spacing={1}
              color={theme.palette['warning'].main}
            >
              <Iconify icon={'carbon:warning'} width={24} height={24} />
              <Typography variant="body2" fontWeight={'200'}>
                Create new discount will in active current discount
              </Typography>
            </Stack>

            {/* <Typography variant="body2">- Amount: Discount amount for product</Typography> */}
            {/* <Typography variant="body2">
              - Expired Date: Expiration date of discount (End of date)
            </Typography> */}
          </>
        )}

        <Typography mt={2} variant="body1">
          Unit price: {fCurrency(product.preDiscount || product.price)}
        </Typography>
        <Typography variant="body1">Price after discount: {fCurrency(price)}</Typography>

        <Box
          sx={{
            mt: 4,
            display: 'grid',
            columnGap: 2,
            rowGap: 3,
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
          }}
        >
          <RHFTextField
            name="amount"
            type="number"
            label="Amount"
            disabled={isEdit}
            onChange={(event: { target: { value: string } }) => {
              if (event.target.value) {
                if (parseInt(event.target.value) > (product.preDiscount || product.price)) {
                  setPrice(0)
                } else {
                  setPrice((product.preDiscount || product.price) - parseInt(event.target.value))
                }
              } else {
                setPrice(product.preDiscount || product.price)
              }
            }}
          />
          <Controller
            name="expiredDate"
            control={control}
            defaultValue={null}
            render={({ field, fieldState: { error } }) => (
              <DatePicker
                disabled={isEdit}
                disablePast
                minDate={tomorrow}
                format="dd/MM/yyyy"
                label="Expired Date"
                value={field.value}
                onChange={(newValue: any) => {
                  if (newValue) field.onChange(newValue)
                }}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: !!error,
                    helperText: error?.message,
                  },
                }}
              />
            )}
          />
        </Box>
        <Stack spacing={1} direction={'row'} justifyContent={'flex-end'} sx={{ mt: 3 }}>
          {isEdit ? (
            <LoadingButton
              type="submit"
              variant="contained"
              color="error"
              loading={isSubmitting || loading}
            >
              Remove discount
            </LoadingButton>
          ) : (
            <LoadingButton type="submit" variant="contained" loading={isSubmitting || loading}>
              Create
            </LoadingButton>
          )}
        </Stack>
      </Card>
    </FormProvider>
  )
}
