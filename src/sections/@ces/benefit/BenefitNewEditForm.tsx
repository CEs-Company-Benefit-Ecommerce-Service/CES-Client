import { useEffect, useMemo } from 'react'
import * as Yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { Controller, useForm } from 'react-hook-form'
import { DatePicker, LoadingButton, TimePicker } from '@mui/lab'
import { Box, Card, Stack, TextField, Typography } from '@mui/material'
import { BenefitData, BenefitPayload, PROJECT_STATUS_OPTIONS_FORM } from 'src/@types/@ces'
import { fDateParam } from 'src/utils/formatTime'
import { FormProvider, RHFSelect, RHFTextField } from '../../../components/hook-form'

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
  const NewUserSchema = Yup.object().shape({
    // name: Yup.string().required('Name is required'),
    // description: Yup.string().required('Description is required'),
    // type: Yup.number().required('Type is required'),
    // unitPrice: Yup.number().required('Unit Price is required'),
  })

  const defaultValues = useMemo(
    () => ({
      name: currentUser?.name || '',
      status: currentUser?.status || 1,
      description: currentUser?.description || '',
      unitPrice: currentUser?.unitPrice || 0,
      type: currentUser?.type,
      timeFilter:
        currentUser?.groups?.[0].timeFilter &&
        new Date().setHours(currentUser?.groups?.[0].timeFilter, 0),
      dateFilter: currentUser?.groups?.[0].dateFilter,
      dayFilter: currentUser?.groups?.[0].dayFilter,
      endDate: currentUser?.groups?.[0].endDate,
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
    if (payload.timeFilter) {
      const parseTimeToNumber = new Date(payload.timeFilter).getHours()
      payload.timeFilter = parseTimeToNumber
    }
    if (!isEdit) delete payload.status
    console.log({ payload })
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
              <RHFTextField name="unitPrice" label="Unit Price" type="number" />
            </Box>

            {isEdit ? (
              <Box flex={1}>
                <RHFSelect name="status" label="Status" placeholder="Status">
                  <option value={undefined} />
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
      </Card>

      <Card sx={{ p: 3, mt: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h6">Config</Typography>
          <Stack direction={'row'} spacing={3}>
            <Controller
              name="endDate"
              control={control}
              defaultValue={null}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  disablePast
                  inputFormat="dd/MM/yyyy"
                  label="Start Date"
                  value={field.value}
                  onChange={(newValue) => {
                    if (newValue) field.onChange(fDateParam(newValue))
                  }}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                  )}
                />
              )}
            />
            <Controller
              name="endDate"
              control={control}
              defaultValue={null}
              render={({ field, fieldState: { error } }) => (
                <DatePicker
                  disablePast
                  inputFormat="dd/MM/yyyy"
                  label="End date"
                  value={field.value}
                  onChange={(newValue) => {
                    if (newValue) field.onChange(fDateParam(newValue))
                  }}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                  )}
                />
              )}
            />
          </Stack>
          <Stack direction={'row'} spacing={3}>
            <RHFSelect name="type" label="Type" placeholder="Status">
              <option value={undefined} />
              {PLAN_TYPE.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </RHFSelect>

            <Controller
              name="timeFilter"
              control={control}
              defaultValue={null}
              render={({ field, fieldState: { error } }) => (
                <TimePicker
                  views={['hours']}
                  ampm={false}
                  label="Time Filter"
                  value={field.value}
                  onChange={(newValue) => {
                    if (newValue) field.onChange(newValue)
                  }}
                  renderInput={(params) => (
                    <TextField {...params} fullWidth error={!!error} helperText={error?.message} />
                  )}
                />
              )}
            />
          </Stack>

          <Stack direction={'row'} spacing={3}>
            {watch('type') == 2 && (
              // <Box sx={{ ml: 1 }}>
              //   <RHFRadioGroup name="dayFilter" options={DAY_IN_WEEK} />
              // </Box>
              <>
                <Box flex={1}>
                  <RHFSelect name="dayFilter" label="Day Filter" placeholder="Status">
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
              // <RHFRadioGroup name="dayFilter" options={DATE_IN_MONTH} />
              <>
                <Box flex={1}>
                  <RHFSelect name="dateFilter" label="Date Filter" placeholder="Status">
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
          </Stack>
        </Stack>
      </Card>

      <Stack alignItems="flex-end" sx={{ mt: 3 }}>
        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {!isEdit ? 'Create Benefit' : 'Save Changes'}
        </LoadingButton>
      </Stack>

      {/* <Grid item xs={12} md={6}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >

            </Box>
          </Card>
        </Grid> */}
    </FormProvider>
  )
}
