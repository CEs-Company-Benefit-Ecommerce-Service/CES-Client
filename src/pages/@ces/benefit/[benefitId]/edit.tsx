import { Badge, Box, Card, Container, Stack, Tab, Tabs, Typography } from '@mui/material'
import { DateCalendar, PickersDay, PickersDayProps } from '@mui/x-date-pickers'
import { capitalCase } from 'change-case'
import {
  addDays,
  addMonths,
  eachWeekOfInterval,
  setDay,
  setHours,
  setMinutes,
  setSeconds,
} from 'date-fns'
import { useRouter } from 'next/router'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'
import { BenefitPayload } from 'src/@types/@ces'
import { benefitApi } from 'src/api-client'
import HeaderBreadcrumbs from 'src/components/HeaderBreadcrumbs'
import Iconify from 'src/components/Iconify'
import Page from 'src/components/Page'
import { useBenefitDetails } from 'src/hooks/@ces'
import useSettings from 'src/hooks/useSettings'
import useTabs from 'src/hooks/useTabs'
import Layout from 'src/layouts'
import { PATH_CES } from 'src/routes/paths'
import BenefitNewEditForm from 'src/sections/@ces/benefit/BenefitNewEditForm'
import BenefitAccountTable from 'src/sections/@ces/benefit/accounts/BenefitAccountTable'
import BenefitMemberTable from 'src/sections/@ces/benefit/members/BenefitMemberTable'

// ----------------------------------------------------------------------

BenefitEditPage.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>
}

// ----------------------------------------------------------------------

export default function BenefitEditPage() {
  const { themeStretch } = useSettings()

  const { enqueueSnackbar } = useSnackbar()
  const { currentTab, onChangeTab } = useTabs('general')
  const { query, push } = useRouter()
  const { benefitId } = query

  const { data, mutate } = useBenefitDetails({ id: `${benefitId}` })

  const handleEditAccountSubmit = async (payload: BenefitPayload) => {
    try {
      await benefitApi.update(`${benefitId}`, payload)
      mutate()
      enqueueSnackbar('Update success!')
      push(PATH_CES.benefit.root)
    } catch (error) {
      enqueueSnackbar('Update failed!', { variant: 'error' })
      console.error(error)
    }
  }

  const initialDate = new Date()

  const [highlightedDays, setHighlightedDays] = useState<Date[]>([])
  const [month, setMonth] = useState(initialDate.getMonth())

  function getDatesDaily(startDate: Date, endDate: Date): Date[] {
    const startTime = setHours(
      setMinutes(setSeconds(startDate, 0), startDate.getMinutes()),
      startDate.getHours()
    )

    const dateList: Date[] = []
    let currentDate = startTime

    while (currentDate <= endDate) {
      dateList.push(currentDate)
      currentDate = addDays(currentDate, 1)
    }

    return dateList
  }

  function getDatesWeekly(targetDayIndex: number, startDate: Date, endDate: Date) {
    const targetDates = eachWeekOfInterval({ start: startDate, end: endDate }).map((weekStart) =>
      setDay(weekStart, targetDayIndex)
    )

    return targetDates
  }

  function getDatesMonthly(startDate: Date, endDate: Date, targetDate: number): Date[] {
    const startTime = setHours(
      setMinutes(setSeconds(startDate, 0), startDate.getMinutes()),
      startDate.getHours()
    )

    const monthlyDates: Date[] = []
    let currentDate = startTime

    while (currentDate <= endDate) {
      if (currentDate.getDate() === targetDate) {
        monthlyDates.push(currentDate)
      }
      currentDate = addMonths(currentDate, 1)
    }

    return monthlyDates
  }

  useEffect(() => {
    if (data?.data) {
      const groups = data?.data?.groups || []
      const type = data?.data?.type || 0
      const startDate = new Date(groups[0]?.firstTime || groups[0]?.timeFilter || '')
      const endDate = new Date(groups[0]?.endDate || '')

      let dates: Date[] = []

      if (type === 1) {
        dates = getDatesDaily(startDate, endDate)
      } else if (type === 2) {
        const targetDayIndex = startDate.getDay()
        dates = getDatesWeekly(targetDayIndex, startDate, endDate)
      } else if (type === 3) {
        const targetDateIndex = startDate.getDate()
        dates = getDatesMonthly(startDate, endDate, targetDateIndex)
      }

      setHighlightedDays(dates.filter((date) => date.getMonth() === month))
    }
  }, [data?.data, month])

  function ServerDay(props: PickersDayProps<Date> & { highlightedDays?: Date[] }) {
    const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props
    const highlightedDaysNumber: number[] = []
    highlightedDays.forEach((e) => {
      highlightedDaysNumber.push(e.getDate())
    })
    const hightLight = highlightedDays.find((e) => e.getDate() === day.getDate())

    const timeNow = new Date().getTime()

    const isTransfer =
      !outsideCurrentMonth &&
      highlightedDaysNumber.includes(day.getDate()) &&
      timeNow > (hightLight?.getTime() || timeNow)

    const isSelected = !outsideCurrentMonth && highlightedDaysNumber.includes(day.getDate())

    return (
      <Badge
        key={day.toString()}
        overlap="circular"
        badgeContent={!isSelected ? undefined : isTransfer ? '✅' : '💲'}
      >
        <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
      </Badge>
    )
  }

  const ACCOUNT_TABS = [
    {
      value: 'general',
      icon: <Iconify icon={'ic:round-account-box'} width={20} height={20} />,
      component: (
        <>
          <BenefitNewEditForm isEdit currentUser={data?.data} onSubmit={handleEditAccountSubmit} />
          <Card sx={{ p: 3, mt: 3 }}>
            <Stack spacing={1}>
              {data?.data?.status === 2 && <Typography>⚠️ This benefit is not active</Typography>}
              <Stack direction={'row'} spacing={2}>
                <Typography>✅: Date is already transfer</Typography>
                <Typography>💲: Next Date transfer</Typography>
              </Stack>
            </Stack>
            {data?.data?.status === 2 ? (
              <DateCalendar
                readOnly
                // disableHighlightToday
                defaultValue={initialDate}
                dayOfWeekFormatter={(day) => `${day}.`}
              />
            ) : (
              <DateCalendar
                readOnly
                onMonthChange={(e) => {
                  setMonth(e.getMonth())
                }}
                // disableHighlightToday
                // defaultValue={initialValue}
                dayOfWeekFormatter={(day) => `${day}.`}
                slots={{
                  day: ServerDay,
                }}
                slotProps={{
                  day: {
                    highlightedDays,
                  } as any,
                }}
              />
            )}
          </Card>
        </>
      ),
    },
    {
      value: 'members',
      icon: <Iconify icon={'fa6-solid:people-line'} width={20} height={20} />,
      component: (
        <BenefitMemberTable benefitId={`${benefitId}`} groupId={data?.data?.groups[0].id || ''} />
      ),
    },
    {
      value: 'accounts',
      icon: <Iconify icon={'fa6-solid:people-line'} width={20} height={20} />,
      component: (
        <BenefitAccountTable benefitId={`${benefitId}`} groupId={data?.data?.groups[0].id || ''} />
      ),
    },
  ]

  return (
    <Page title="Benefit: Edit Benefit">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="Edit benefit"
          links={[
            { name: 'Dashboard', href: '' },
            { name: 'Benefit', href: '' },
            { name: data?.data?.name || (benefitId as string) },
          ]}
        />

        <Tabs
          allowScrollButtonsMobile
          variant="scrollable"
          scrollButtons="auto"
          value={currentTab}
          onChange={onChangeTab}
        >
          {ACCOUNT_TABS.map((tab) => (
            <Tab
              disableRipple
              key={tab.value}
              label={capitalCase(tab.value)}
              icon={tab.icon}
              value={tab.value}
            />
          ))}
        </Tabs>

        <Box sx={{ mb: 5 }} />

        {!data ? (
          <>Loading...</>
        ) : (
          ACCOUNT_TABS.map((tab) => {
            const isMatched = tab.value === currentTab
            return isMatched && <Box key={tab.value}>{tab.component}</Box>
          })
        )}
      </Container>
    </Page>
  )
}
