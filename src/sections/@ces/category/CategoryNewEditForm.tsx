import { yupResolver } from '@hookform/resolvers/yup'
// @mui
import { LoadingButton } from '@mui/lab'
import { Box, Card, Grid, Stack, Typography } from '@mui/material'
// next
import { useCallback, useEffect, useMemo } from 'react'
// form
import { useForm } from 'react-hook-form'
import { CategoryPayload } from 'src/@types/@ces'
import { fData } from 'src/utils/formatNumber'
import uploadImageCategory from 'src/utils/uploadImageCategory'
import * as Yup from 'yup'
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form'
// routes
// ----------------------------------------------------------------------

// type FormValuesProps = CategoryPayload

type Props = {
  isEdit?: boolean
  currentUser?: CategoryPayload
  onSubmit?: (payload: CategoryPayload) => void
}

export default function UserNewEditForm({ isEdit = false, currentUser, onSubmit }: Props) {
  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
  })

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      description: currentUser?.description || '',
      imageUrl: currentUser?.imageUrl,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  )

  const methods = useForm<CategoryPayload>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  })

  const {
    reset,
    // watch,
    // control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  // const values = watch()

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues)
    }
    if (!isEdit) {
      reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser])

  const handleOnSubmit = async (data: CategoryPayload) => {
    await onSubmit?.(data)
  }

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      uploadImageCategory({ acceptedFiles, setValue })
    },
    [setValue]
  )

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleOnSubmit)}>
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
              <RHFTextField name="name" label="Name" />
              {/* <RHFTextField name="Price" label="Giá sản phẩm" />
                            <RHFTextField name="Quantity" label="Số lượng" /> */}
              {/* <RHFSelect name="status" label="status" placeholder="status">
                                <option value="" />
                                {countries.map((option) => (
                                    <option key={option.code} value={option.label}>
                                        {option.label}
                                    </option>
                                ))}
                            </RHFSelect> */}

              {/* <RHFTextField name="description" label="Description" /> */}
              {/* <RHFTextField name="ServiceDuration" label="City" />
                            <RHFTextField name="Type" label="Address" /> */}
              {/* <RHFTextField name="zipCode" label="Zip/Code" />
                            <RHFTextField name="company" label="Company" />
                            <RHFTextField name="role" label="Role" /> */}
            </Box>
            <Box my={3}>
              <RHFTextField name="description" label="Description" />
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Category' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
