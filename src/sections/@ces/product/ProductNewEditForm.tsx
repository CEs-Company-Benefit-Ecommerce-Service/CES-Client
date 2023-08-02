import { yupResolver } from '@hookform/resolvers/yup'
// @mui
import { LoadingButton } from '@mui/lab'
import { Box, Card, Grid, Stack, Typography } from '@mui/material'
// next
import { useCallback, useEffect, useMemo } from 'react'
// form
import { useForm } from 'react-hook-form'
import { Category, ProductPayload, PROJECT_STATUS_OPTIONS_FORM } from 'src/@types/@ces'
import { useCategoryList } from 'src/hooks/@ces/useCategory'
import uploadImage from 'src/utils/uploadImage'
import * as Yup from 'yup'
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from '../../../components/hook-form'
// routes
// utils
import { fData } from '../../../utils/formatNumber'

// ----------------------------------------------------------------------

type Props = {
  isEdit?: boolean
  currentUser?: ProductPayload
  onSubmit?: (payload: ProductPayload) => void
}

export default function ProductNewEditForm({ isEdit = false, currentUser, onSubmit }: Props) {
  // const { push } = useRouter()
  const { data } = useCategoryList({})
  const categories: Category[] = data?.data ?? []
  // const { enqueueSnackbar } = useSnackbar()

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    price: Yup.number().required('Price is required'),
    quantity: Yup.number().required('Quantity is required'),
    categoryId: Yup.string().required('CategoryId is required'),
    // description: Yup.string().required('Description is required'),
    imageUrl: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
  })

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      price: currentUser?.price || 0,
      quantity: currentUser?.quantity || 0,
      categoryId: currentUser?.categoryId || '',
      status: currentUser?.status || 1,
      description: currentUser?.description || '',
      imageUrl: currentUser?.imageUrl || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentUser]
  )

  const methods = useForm<ProductPayload>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  })

  const {
    reset,
    watch,
    // control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const statusList = PROJECT_STATUS_OPTIONS_FORM

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues)
    }
    if (!isEdit) {
      reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser])

  const handleFormSubmit = async (data: ProductPayload) => {
    await onSubmit?.(data)
  }
  //------------------------IMAGE UPLOAD------------------------
  const handleDrop = useCallback(
    async (acceptedFiles) => {
      uploadImage({ acceptedFiles, setValue })
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
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="price" label="Price" />
              <RHFTextField name="quantity" label="Quantity" />
              <RHFSelect name="categoryId" label="Category" placeholder="category">
                <option value={undefined} />
                {categories.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.name}
                  </option>
                ))}
              </RHFSelect>
              <RHFTextField name="description" label="Description" />

              <RHFSelect name="status" label="Status" placeholder="Status">
                <option value={undefined} />
                {statusList.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Product' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
