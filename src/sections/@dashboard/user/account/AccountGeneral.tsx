import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
// @mui
import { Box, Card, Grid, Stack, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import { useCallback } from 'react'
// form
import { useForm } from 'react-hook-form'
import { AccountPayload } from 'src/@types/@ces'
import { accountApi } from 'src/api-client'
import Label from 'src/components/Label'
import uploadImageAccount from 'src/utils/uploadImageAccount'
import * as Yup from 'yup'
// components
import { FormProvider, RHFTextField, RHFUploadAvatar } from '../../../../components/hook-form'
// hooks
import useAuth from '../../../../hooks/useAuth'
// utils
import { fData } from '../../../../utils/formatNumber'
// _mock

// ----------------------------------------------------------------------

export default function AccountGeneral() {
  const { enqueueSnackbar } = useSnackbar()

  const { user } = useAuth()
  const accountId = user?.id

  const UpdateUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().required('Email is required').email(),
    address: Yup.string().required('Address is required'),
    phone: Yup.string().required('Phone is required'),
    imageUrl: Yup.mixed().test('required', 'Avatar is required', (value) => value !== ''),
  })

  const defaultValues = {
    name: user?.name || '',
    email: user?.email || '',
    imageUrl: user?.imageUrl || '',
    phone: user?.phone || '',
    address: user?.address || '',
    status: user?.status,
    role: user?.role,
  }

  const methods = useForm<AccountPayload>({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
  })

  const {
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const onSubmit = async (data: AccountPayload) => {
    try {
      accountApi.update(accountId!, data)
      enqueueSnackbar('Update success!')
    } catch (error) {
      console.error(error)
    }
  }

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      uploadImageAccount({ acceptedFiles, setValue })
    },
    [setValue]
  )

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3, textAlign: 'center' }}>
            <Label
              color={user?.status !== 1 ? 'error' : 'success'}
              sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
            >
              {user?.status === 1 ? 'Active' : 'In Active'}
            </Label>
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
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                rowGap: 3,
                columnGap: 2,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="name" label="Name" />
              <RHFTextField name="email" label="Email Address" disabled />

              <RHFTextField name="phone" label="Phone Number" />
              <RHFTextField name="address" label="Address" />
            </Box>

            <Stack spacing={3} alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                Save Changes
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
