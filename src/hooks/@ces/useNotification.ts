import { Params } from 'src/@types/@ces'
import { notificationApi } from 'src/api-client'
import useSWR, { SWRConfiguration } from 'swr'

interface NotificationParams extends Params {
  isRead: boolean
}

type UseNotificationProps = {
  params?: Partial<NotificationParams>
  options?: SWRConfiguration
  id?: string
  enable?: boolean
}

export function useNotificationList({
  options,
  params = { Page: 1, Sort: 'createdAt', Order: 'desc' },
}: UseNotificationProps) {
  const { data, error, mutate, isValidating, isLoading } = useSWR(
    ['notification-list', params],
    () => notificationApi.getAll(params!),
    {
      refreshInterval: 5 * 1000, // 5s
      ...options,
    }
  )

  return {
    data,
    error,
    mutate,
    isValidating,
    isLoading,
  }
}

export function useNotificationDetails({ id, options }: UseNotificationProps) {
  const { data, error, mutate } = useSWR(['notification', id], () => notificationApi.getById(id!), {
    ...options,
  })

  return {
    data,
    error,
    mutate,
  }
}
