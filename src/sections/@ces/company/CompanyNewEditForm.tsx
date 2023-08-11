import { yupResolver } from '@hookform/resolvers/yup'
// @mui
import { DatePicker, LoadingButton } from '@mui/lab'
import {
  Box,
  Card,
  FilledTextFieldProps,
  Grid,
  OutlinedTextFieldProps,
  Stack,
  StandardTextFieldProps,
  TextField,
  TextFieldVariants,
  Typography,
} from '@mui/material'
// next
import { JSX, useCallback, useEffect, useMemo } from 'react'
// form
import { Controller, useForm } from 'react-hook-form'
import { CompanyPayload } from 'src/@types/@ces'
import uploadCompanyImage from 'src/utils/uploadCompanyImage'
import * as Yup from 'yup'
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form'
// routes
// utils
import { fDateParam } from 'src/utils/formatTime'
import { fData } from '../../../utils/formatNumber'

// ----------------------------------------------------------------------

type Props = {
  isEdit?: boolean
  currentUser?: CompanyPayload
  onSubmit?: (payload: CompanyPayload) => void
}

export default function CompanyNewEditForm({ isEdit = false, currentUser, onSubmit }: Props) {
  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    address: Yup.string().required('Address is required'),
    expiredDate: Yup.string().required('ExpiredDate is required'),
    limits: Yup.number().required('Limits is required'),
    // imageUrl: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
  })

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      address: currentUser?.address || '',
      expiredDate: currentUser?.expiredDate || '',
      limits: currentUser?.limits || 0,
      imageUrl: currentUser?.imageUrl || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  )

  const methods = useForm<CompanyPayload>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  })

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const values = watch('expiredDate')
  console.log(values)

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues)
    }
    if (!isEdit) {
      reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser])

  const handleFormSubmit = async (payload: CompanyPayload) => {
    const formatExp = fDateParam(payload.expiredDate)
    payload.expiredDate = formatExp
    await onSubmit?.(payload)
  }
  //------------------------IMAGE UPLOAD------------------------
  const handleDrop = useCallback(
    async (acceptedFiles) => {
      uploadCompanyImage({ acceptedFiles, setValue })
    },
    [setValue]
  )
  //------------------------IMAGE UPLOAD------------------------

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleFormSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="imageUrl"
                accept="image/*"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 2,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.secondary',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="name" label="Company Name" />
              <RHFTextField name="address" label="Company Address" />
              <RHFTextField name="limits" label="Limit" type="number" />

              <Controller
                name="expiredDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    label="Expired date"
                    value={field.value}
                    onChange={(newValue: any) => {
                      field.onChange(newValue)
                    }}
                    renderInput={(
                      params: JSX.IntrinsicAttributes & {
                        variant?: TextFieldVariants | undefined
                      } & Omit<
                          FilledTextFieldProps | OutlinedTextFieldProps | StandardTextFieldProps,
                          'variant'
                        >
                    ) => (
                      <TextField
                        {...params}
                        fullWidth
                        error={!!error}
                        helperText={error?.message}
                      />
                    )}
                  />
                )}
              />
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Company' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
