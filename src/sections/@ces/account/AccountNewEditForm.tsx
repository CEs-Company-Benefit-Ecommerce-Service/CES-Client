import { useCallback, useEffect, useMemo, useState } from 'react'
import * as Yup from 'yup'
// next
// form
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
// @mui
import { DatePicker, LoadingButton } from '@mui/lab'
import {
  Box,
  Card,
  Grid,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
// utils
import { fData } from '../../../utils/formatNumber'
// routes
// @types
// _mock
// components
import {
  ACCOUNT_STATUS_OPTIONS_FORM,
  AccountData,
  AccountPayload,
  AccountStatus,
  ROLE_OPTIONS_FORM_EA,
  ROLE_OPTIONS_FORM_SA,
  Role,
} from 'src/@types/@ces/account'
import Iconify from 'src/components/Iconify'
import useAuth from 'src/hooks/useAuth'
import { fDateParam, fDateVN } from 'src/utils/formatTime'
import Label from '../../../components/Label'
import {
  FormProvider,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
} from '../../../components/hook-form'

// ----------------------------------------------------------------------

type Props = {
  isEdit?: boolean
  currentUser?: AccountData
  onSubmit?: (payload: AccountPayload) => void
}

export default function AccountNewEditForm({ isEdit = false, currentUser, onSubmit }: Props) {
  const [showPassword, setShowPassword] = useState(false)
  const { user } = useAuth()

  const NewUserSchema = isEdit
    ? Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required').email(),
        address: Yup.string().required('Address is required'),
        phone: Yup.string().required('Phone is required'),
        status: Yup.number().required('Status is required'),
        role: Yup.number().required('Role is required'),
      })
    : user?.role == Role['System Admin']
    ? Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required').email('Email must be a valid email'),
        address: Yup.string().required('Address is required'),
        phone: Yup.string().required('Phone is required'),
        status: Yup.number().required('Status is required'),
        role: Yup.number().required('Role is required'),
        password: Yup.string()
          .required('Password is required')
          .min(6, 'Password must be at least 6 characters'),
        company: Yup.object().when('role', {
          is: Role['Enterprise Admin'],
          then: Yup.object().shape({
            name: Yup.string().required('Company Name is required'),
            expiredDate: Yup.string().required('Expired Date is required'),
            limits: Yup.number().required('Limit is required'),
          }),
        }),
      })
    : Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required').email(),
        address: Yup.string().required('Address is required'),
        phone: Yup.string().required('Phone is required'),
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
      role: currentUser?.role
        ? currentUser?.role
        : user?.role == Role['Enterprise Admin']
        ? Role.Employee
        : undefined,
      password: '',
      companyId: null,
      company: null,
      // company: {
      //   address: '',
      //   expiredDate: '',
      //   imageUrl: '',
      //   limits: 0,
      //   name: '',
      // },
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
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods

  const values = watch()
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
    if (
      payload.role === Role['Enterprise Admin'] &&
      payload.company &&
      payload.company.expiredDate
    ) {
      payload = {
        ...payload,
        company: {
          ...payload.company,
          expiredDate: fDateParam(payload.company.expiredDate),
          imageUrl: payload.imageUrl,
          address: payload.address,
        },
      }
    }

    await onSubmit?.(payload)
  }

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0]

      if (file) {
        setValue(
          'imageUrl',
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      }
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
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ py: 10, px: 3 }}>
            {isEdit && (
              <Label
                color={values.status !== 1 ? 'error' : 'success'}
                sx={{ textTransform: 'uppercase', position: 'absolute', top: 24, right: 24 }}
              >
                {values.status === 1 ? 'Active' : 'In Active'}
              </Label>
            )}

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

            {/* {isEdit && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 1}
                        onChange={(event) => field.onChange(event.target.checked ? 2 : 1)}
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      In Active
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply in active account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )} */}
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
              <RHFTextField name="email" label="Email Address" disabled={isEdit} />
              {!isEdit && (
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
              <RHFTextField name="phone" label="Phone Number" />
              {!(user?.role == Role['Enterprise Admin']) && (
                <RHFTextField name="address" label="Address" />
              )}
              {/* <RHFTextField name="address" label="Address" /> */}
              <RHFSelect name="status" label="Status" placeholder="Status">
                <option value={undefined} />
                {statusList.map((option) => (
                  <option key={option.code} value={option.code}>
                    {option.label}
                  </option>
                ))}
              </RHFSelect>
              {!(user?.role == Role['Enterprise Admin']) && (
                <RHFSelect name="role" label="Role" placeholder="Role" disabled={isEdit}>
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
                  <RHFTextField name="company.name" label="Company Name" />
                  <Controller
                    name="company.expiredDate"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <DatePicker
                        disablePast
                        inputFormat="dd/MM/yyyy"
                        label="Expired date"
                        value={field.value}
                        onChange={(newValue) => {
                          if (newValue) field.onChange(fDateVN(newValue))
                          field.onChange(newValue)
                        }}
                        renderInput={(params) => (
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
                  {/* <RHFTextField
                    name="company.expiredDate"
                    label="Company Expired Date"
                    type="date"
                  /> */}

                  <RHFTextField name="company.limits" label="Limit" type="number" />
                </>
              )}
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!isEdit ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  )
}
