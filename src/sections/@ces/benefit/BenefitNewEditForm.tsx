import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Box, Card, InputAdornment, Stack, Typography } from '@mui/material'
import { DatePicker, TimePicker, renderTimeViewClock } from '@mui/x-date-pickers'
import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { BenefitData, BenefitPayload, PROJECT_STATUS_OPTIONS_FORM } from 'src/@types/@ces'
import { fDateParam, fDateTimeParam } from 'src/utils/formatTime'
import * as Yup from 'yup'
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form'
import useAuth from 'src/hooks/useAuth'

// ----------------------------------------------------------------------

type Props = {
  isEdit?: boolean
  currentUser?: BenefitData
  onSubmit?: (payload: BenefitPayload) => void
}
const DATE_IN_MONTH = Array.from({ length: 31 }, (_, i) => ({
  label: (i + 1).toString(),
  value: i + 1,
}))

const DAY_IN_WEEK = [
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
  { label: 'Sunday', value: 7 },
]
const PLAN_TYPE = [
  { label: 'Daily', value: 1 },
  { label: 'Weekly', value: 2 },
  { label: 'Monthly', value: 3 },
]

export default function BenefitNewEditForm({ isEdit = false, currentUser, onSubmit }: Props) {
  const { user } = useAuth()
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)

  const NewUserSchema = !isEdit
    ? Yup.object().shape({
        name: Yup.string().required('Name is required'),
        description: Yup.string().required('Description is required'),
        type: Yup.number().required('Type is required'),
        unitPrice: Yup.number().required('Unit Price is required'),
        endDate: Yup.date().required('End Date is required'),
        timeFilter: Yup.date().required('Time Filter is required'),
        dayFilter: Yup.number().when('type', {
          is: 2,
          then: Yup.number().required('Day Filter is required'),
        }),
        dateFilter: Yup.number().when('type', {
          is: 3,
          then: Yup.number().required('Date Filter is required'),
        }),
      })
    : Yup.object().shape({
        name: Yup.string().required('Name is required'),
        description: Yup.string().required('Description is required'),
        unitPrice: Yup.number().required('Unit Price is required'),
      })

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      status: currentUser?.status || 1,
      description: currentUser?.description || '',
      unitPrice: currentUser?.unitPrice,
      type: currentUser?.type || 1,
      timeFilter: new Date(currentUser?.groups?.[0].timeFilter || ''),
      dateFilter: currentUser?.groups?.[0].dateFilter,
      dayFilter: currentUser?.groups?.[0].dayFilter,
      endDate: new Date(currentUser?.groups?.[0].endDate || ''),
      firstTime: new Date(currentUser?.groups?.[0].firstTime || ''),
    }),
    [currentUser]
  )

  const methods = useForm<BenefitPayload>({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  })

  const {
    reset,
    watch,
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

  const handleFormSubmit = async (payload: BenefitPayload) => {
    if (payload.timeFilter && payload.endDate) {
      const parseDateParam = fDateParam(payload.endDate)
      payload.endDate = parseDateParam
      const parseTimeToNumber = fDateTimeParam(payload.timeFilter)
      payload.timeFilter = parseTimeToNumber
    }
    if (!isEdit) {
      delete payload.status
      delete payload.firstTime
    }
    await onSubmit?.(payload)
  }

  const statusList = PROJECT_STATUS_OPTIONS_FORM

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleFormSubmit)}>
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6">Information</Typography>
          <Stack direction={'row'} spacing={3}>
            <RHFTextField name="name" label="Name" />
            <RHFTextField name="description" label="Description" />
          </Stack>
          <Stack direction={'row'} spacing={3}>
            <Box flex={1}>
              <RHFTextField
                name="unitPrice"
                label="Unit Price"
                type="number"
                onKeyDown={(evt) => ['e', 'E', '+', '-'].includes(evt.key) && evt.preventDefault()}
                InputProps={{
                  endAdornment: <InputAdornment position="start">đ</InputAdornment>,
                }}
              />
            </Box>

            {isEdit ? (
              <Box flex={1}>
                <RHFSelect name="status" label="Status" placeholder="Status">
                  {/* <option value={undefined} /> */}
                  {statusList.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.label}
                    </option>
                  ))}
                </RHFSelect>
              </Box>
            ) : (
              <Box flex={1} />
            )}
          </Stack>
        </Stack>
        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            {!isEdit ? 'Create Benefit' : 'Edit Benefit'}
          </LoadingButton>
        </Stack>
      </Card>

      <Card sx={{ p: 3, mt: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6">Config</Typography>
          <Stack direction={'row'} spacing={3}>
            {isEdit && (
              <Controller
                name="firstTime"
                control={control}
                defaultValue={null}
                render={({ field, fieldState: { error } }) => (
                  <DatePicker
                    disabled={isEdit}
                    disablePast
                    minDate={tomorrow}
                    format="dd/MM/yyyy"
                    label="Start Date"
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
            )}
            <Controller
              name="endDate"
              control={control}
              defaultValue={null}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  disabled={isEdit}
                  disablePast
                  minDate={tomorrow}
                  maxDate={new Date(user?.company.expiredDate || '')}
                  format="dd/MM/yyyy"
                  label="End Date"
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
            <RHFSelect name="type" label="Type" placeholder="Status" disabled={isEdit}>
              <option value={undefined} />
              {PLAN_TYPE.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </RHFSelect>
          </Stack>
          <Stack direction={'row'} spacing={3}>
            <Box flex={1}>
              <Controller
                name="timeFilter"
                control={control}
                defaultValue={null}
                render={({ field, fieldState: { error } }) => (
                  <TimePicker
                    disabled={isEdit}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                    }}
                    ampm={false}
                    label="Time Filter"
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
            {watch('type') != 2 && watch('type') != 3 && <Box flex={1} />}
            {watch('type') == 2 && (
              <Box flex={1}>
                <RHFSelect
                  name="dayFilter"
                  label="Day Filter"
                  placeholder="Status"
                  disabled={isEdit}
                >
                  <option value={undefined} />
                  {DAY_IN_WEEK.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </RHFSelect>
              </Box>
            )}
            {watch('type') == 3 && (
              <Box flex={1}>
                <RHFSelect
                  name="dateFilter"
                  label="Date Filter"
                  placeholder="Status"
                  disabled={isEdit}
                >
                  <option value={undefined} />
                  {DATE_IN_MONTH.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </RHFSelect>
              </Box>
            )}
          </Stack>

          {/* <Stack direction={'row'} spacing={3}>
            {watch('type') == 2 && (
              <>
                <Box flex={1}>
                  <RHFSelect
                    name="dayFilter"
                    label="Day Filter"
                    placeholder="Status"
                    disabled={isEdit}
                  >
                    <option value={undefined} />
                    {DAY_IN_WEEK.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>
                </Box>
                <Box flex={1} />
              </>
            )}
            {watch('type') == 3 && (
              <>
                <Box flex={1}>
                  <RHFSelect
                    name="dateFilter"
                    label="Date Filter"
                    placeholder="Status"
                    disabled={isEdit}
                  >
                    <option value={undefined} />
                    {DATE_IN_MONTH.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </RHFSelect>
                </Box>
                <Box flex={1} />
              </>
            )}
          </Stack> */}
        </Stack>
      </Card>
    </FormProvider>
  )
}
