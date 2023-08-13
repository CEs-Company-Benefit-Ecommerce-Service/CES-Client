import { format, getTime, formatDistanceToNow } from 'date-fns'
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz'

// ----------------------------------------------------------------------

export function fDate(date: Date | string | number) {
  if (date) return format(new Date(date), 'dd MMMM yyyy')
  else return 'Nah'
}

export function fDateVN(date: Date | string | number) {
  if (date) return format(new Date(date), 'dd/MM/yyyy')
  else return ''
}

export function fTime(date: Date | string | number) {
  if (date) return format(new Date(date), 'hh:mm a')
  else return ''
}

export function fDateParam(date: Date | string | number) {
  if (date) return format(new Date(date), 'yyyy-MM-dd')
  else return ''
}

export function fDateTimeParam(date: Date | string | number) {
  if (date) {
    const timeZone = 'Asia/Bangkok'
    return formatInTimeZone(new Date(date), timeZone, "yyyy-MM-dd'T'HH:mm:ss")
  } else {
    return ''
  }
}

export function fDateTime(date: Date | string | number) {
  if (date) return format(new Date(date), 'dd MMM yyyy p')
  else return ''
}

export function fTimestamp(date: Date | string | number) {
  return getTime(new Date(date))
}

export function fDateTimeSuffix(date: Date | string | number) {
  if (date) return format(new Date(date), 'dd/MM/yyyy hh:mm p')
  else return ''
}

export function fToNow(date: Date | string | number) {
  return formatDistanceToNow(new Date(date), {
    addSuffix: true,
  })
}
