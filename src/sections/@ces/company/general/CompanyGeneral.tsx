// @mui
import { Box, Card, Grid, IconButton, InputAdornment, Stack, Typography } from '@mui/material'
import { useSnackbar } from 'notistack'
import {
  ACCOUNT_STATUS_OPTIONS_FORM,
  AccountData,
  AccountPayload,
  AccountStatus,
  CompanyPayload,
  ROLE_OPTIONS_FORM_EA,
  ROLE_OPTIONS_FORM_SA,
  Role,
} from 'src/@types/@ces'
import { accountApi, companyApi } from 'src/api-client'
import { useAccountDetails, useCompanyDetails } from 'src/hooks/@ces'
import { fData } from 'src/utils/formatNumber'
// import CompanyNewEditForm from '../CompanyNewEditForm'

// ----------------------------------------------------------------------

type Props = {
  accountId?: string
  companyId: string
}

export default function CompanyGeneral({ accountId, companyId }: Props) {
  const { enqueueSnackbar } = useSnackbar()

  const { data, mutate: mutateCompany } = useCompanyDetails({ id: `${companyId}` })
  const { data: accountDetails, mutate: mutateAccount } = useAccountDetails({
    enable: Boolean(data?.data?.contactPersonId),
    id: data?.data?.contactPersonId,
  })

  const handleEditCompanySubmit = async (payload: CompanyPayload) => {
    try {
      await companyApi.update(`${companyId}`, payload)
      mutateCompany()
      enqueueSnackbar('Update success!')
    } catch (error) {
      enqueueSnackbar('Update failed!', { variant: 'error' })
      console.error(error)
    }
  }
  const handleEditAccountSubmit = async (payload: AccountPayload) => {
    try {
      await accountApi.update(`${data?.data?.contactPersonId}`, payload)
      mutateAccount()
      enqueueSnackbar('Update success!')
    } catch (error) {
      enqueueSnackbar('Update failed!', { variant: 'error' })
      console.error(error)
    }
  }

  return (
    <Grid container spacing={3}>
      {!accountDetails && !data ? (
        <Grid item xs={12}>
          <>Loading...</>
        </Grid>
      ) : (
        <>
          <Grid item xs={12}>
            <CompanyEditFormGeneral
              isEdit
              currentUser={data?.data}
              onSubmit={handleEditCompanySubmit}
            />
          </Grid>
          <Grid item xs={12}>
            <AccountEditFormGeneral
              isEdit
              currentUser={accountDetails?.data}
              onSubmit={handleEditAccountSubmit}
            />
          </Grid>
        </>
      )}
    </Grid>
  )
}

// -------------------------------------------------------------------------
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { DatePicker } from '@mui/x-date-pickers'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import Iconify from 'src/components/Iconify'
import { FormProvider, RHFSelect, RHFTextField, RHFUploadAvatar } from 'src/components/hook-form'
import useAuth from 'src/hooks/useAuth'
import { fDateParam } from 'src/utils/formatTime'
import uploadCompanyImage from 'src/utils/uploadCompanyImage'
import uploadImageAccount from 'src/utils/uploadImageAccount'
import * as Yup from 'yup'

type CompanyEditFormGeneralProps = {
  isEdit?: boolean
  currentUser?: CompanyPayload
  onSubmit?: (payload: CompanyPayload) => void
}

function CompanyEditFormGeneral({
  isEdit = false,
  currentUser,
  onSubmit,
}: CompanyEditFormGeneralProps) {
  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    address: Yup.string().required('Address is required'),
    expiredDate: Yup.string().required('ExpiredDate is required'),
    limits: Yup.number().required('Limits is required'),
  })

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      address: currentUser?.address || '',
      expiredDate: new Date(currentUser?.expiredDate || ''),
      limits: currentUser?.limits || '',
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
    // watch,
    control,
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

  const handleFormSubmit = async (payload: CompanyPayload) => {
    if (payload.expiredDate) {
      const formatExp = fDateParam(payload.expiredDate)
      payload.expiredDate = formatExp
    }
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
      <Card sx={{ p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h6">Company Information</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
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
          </Grid>
          <Grid item xs={12} md={8}>
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
              <RHFTextField
                name="limits"
                label="Limit"
                type="number"
                onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
                // onChange={(event: { target: { value: any } }) => {
                //   if (event.target.value) setValue(`limits`, Number(event.target.value))
                // }}
                InputProps={{
                  endAdornment: <InputAdornment position="start">đ</InputAdornment>,
                }}
              />

              <Controller
                name="expiredDate"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    disablePast
                    format="dd/MM/yyyy"
                    label="Expired date"
                    value={field.value}
                    onChange={(newValue) => {
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

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create Company' : 'Edit'}
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </FormProvider>
  )
}
// -------------------------------------------------------------------------
type AccountEditFormGeneralProps = {
  isDetail?: boolean
  isViewCompany?: boolean
  isEdit?: boolean
  currentUser?: AccountData
  onSubmit?: (payload: AccountPayload) => void
}

function AccountEditFormGeneral({
  isEdit = false,
  currentUser,
  onSubmit,
  isDetail,
  isViewCompany,
}: AccountEditFormGeneralProps) {
  const [showPassword, setShowPassword] = useState(false)
  const { user } = useAuth()
  const { pathname } = useRouter()

  const NewUserSchema = isEdit
    ? Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required').email(),
        address: Yup.string().required('Address is required'),
        phone: Yup.string()
          .required('Phone is required')
          .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Phone number is not valid'),
        status: Yup.number().required('Status is required'),
        role: Yup.number().required('Role is required'),
      })
    : user?.role == Role['System Admin']
    ? Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required').email('Email must be a valid email'),
        address: Yup.string().required('Address is required'),
        phone: Yup.string()
          .required('Phone is required')
          .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Phone number is not valid'),
        status: Yup.number().required('Status is required'),
        role: Yup.number().required('Role is required'),
        password: Yup.string()
          .required('Password is required')
          .min(6, 'Password must be at least 6 characters'),
        company: Yup.object().when('role', {
          is: Role['Enterprise Admin'],
          then: Yup.object().shape({
            name: Yup.string().required('Company Name is required'),
            // expiredDate: Yup.string().required('Expired Date is required'),
            // limits: Yup.number().required('Limit is required'),
          }),
        }),
      })
    : Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required').email(),
        address: Yup.string().required('Address is required'),
        phone: Yup.string()
          .required('Phone is required')
          .matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g, 'Phone number is not valid'),
        status: Yup.number().required('Status is required'),
        role: Yup.number().required('Role is required'),
      })

  const defaultValues: AccountPayload = useMemo(
    () => ({
      name: currentUser?.name || '',
      email: currentUser?.email || '',
      address: currentUser?.address
        ? currentUser?.address
        : user?.role == Role['Enterprise Admin']
        ? user.address
        : '',
      phone: currentUser?.phone || '',
      imageUrl:
        currentUser?.imageUrl === 'string'
          ? null
          : currentUser?.imageUrl
          ? currentUser?.imageUrl
          : null,
      status: currentUser?.status || AccountStatus['Active'],
      role: Role['Enterprise Admin'],
      password: '',
      // companyId: null,
      // company
    }),
    [currentUser, user]
  )

  const methods = useForm<AccountPayload>({
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

  // const values = watch()
  const watchShowCompany = watch('role')

  useEffect(() => {
    if (isEdit && currentUser) {
      reset(defaultValues)
    }
    if (!isEdit) {
      reset(defaultValues)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentUser])

  const handleFormSubmit = async (payload: AccountPayload) => {
    if (payload.role === Role['Enterprise Admin'] && payload.company) {
      payload = {
        ...payload,
        company: {
          ...payload.company,
          limits: 0,
          expiredDate: fDateParam(payload.company.expiredDate || Date.now()),
          imageUrl: payload.imageUrl,
          address: payload.address,
        },
      }
    }

    await onSubmit?.(payload)
  }

  const handleDrop = useCallback(
    async (acceptedFiles) => {
      uploadImageAccount({ acceptedFiles, setValue })
    },
    [setValue]
  )

  const statusList = ACCOUNT_STATUS_OPTIONS_FORM

  type RoleOptions = typeof ROLE_OPTIONS_FORM_SA | typeof ROLE_OPTIONS_FORM_EA
  const roleOptionsLookup: Partial<Record<Role, RoleOptions>> = {
    [Role['System Admin']]: ROLE_OPTIONS_FORM_SA,
    [Role['Enterprise Admin']]: ROLE_OPTIONS_FORM_EA,
  }
  const roleList: RoleOptions = roleOptionsLookup[user?.role as Role] || []

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleFormSubmit)}>
      <Card sx={{ p: 3 }}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Typography variant="h6">Admin Account Information</Typography>
          </Grid>
          {!isViewCompany && (
            <Grid item xs={12} md={4}>
              <Box>
                <RHFUploadAvatar
                  disabled={isDetail}
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
            </Grid>
          )}

          <Grid item xs={12} md={!isViewCompany ? 8 : 12}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="name" label="Name" disabled={isDetail} />
              <RHFTextField name="email" label="Email Address" disabled={isEdit || isDetail} />
              {!isEdit && !isDetail && (
                <RHFTextField
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              )}
              <RHFTextField name="phone" label="Phone Number" disabled={isDetail} />
              {!(user?.role == Role['Enterprise Admin']) && (
                <RHFTextField name="address" label="Address" disabled={isDetail} />
              )}
              <RHFSelect name="status" label="Status" placeholder="Status" disabled={isDetail}>
                <option value={undefined} />
                {statusList.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              {pathname !== '/dashboard/user/account' && !(user?.role == Role['Enterprise Admin']) && (
                <RHFSelect
                  name="role"
                  label="Role"
                  placeholder="Role"
                  disabled={isEdit || isDetail}
                >
                  <option value={undefined} />
                  {roleList?.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </RHFSelect>
              )}
              <Box />
              {watchShowCompany == Role['Enterprise Admin'] && !isEdit && (
                <>
                  <RHFTextField name="company.name" label="Company Name" disabled={isDetail} />
                </>
              )}
            </Box>

            <Stack alignItems="flex-end">
              {!isDetail && (
                <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                  {!isEdit ? 'Create User' : 'Edit'}
                </LoadingButton>
              )}
            </Stack>
          </Grid>
        </Grid>
      </Card>
    </FormProvider>
  )
}
// -------------------------------------------------------------------------
