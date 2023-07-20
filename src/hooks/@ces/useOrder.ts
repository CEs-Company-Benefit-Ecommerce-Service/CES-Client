import { Params } from 'src/@types/@ces'
import { orderApi } from 'src/api-client/order'
import { productApi } from 'src/api-client/product'
import useSWR, { SWRConfiguration } from 'swr'

type UseOrderProps = {
  params?: Partial<Params>
  options?: SWRConfiguration
  id?: string
}
export function useOrder({ params = { Page: 1 }, options }: UseOrderProps) {
  const { data, error, mutate, isLoading, isValidating } = useSWR(
    ['/order', params],
    () => orderApi.getAll(params!),
    {
      keepPreviousData: true,
      fallbackData: {
        code: 0,
        message: '',
        metaData: null,
        data: [],
      },
      ...options,
    }
  )

  return {
    data,
    error,
    isValidating,
    mutate,
    isLoading,
  }
}

export function useOrderDetail({ id, options }: UseOrderProps) {
  const { data, error, mutate, isLoading, isValidating } = useSWR(
    ['order-detail', id],
    () => orderApi.getById(id!),
    {
      keepPreviousData: true,
      fallbackData: {
        code: 0,
        message: '',
        metaData: null,
        data: {},
      },
      ...options,
    }
  )

  return {
    data,
    isValidating,
    error,
    mutate,
    isLoading,
  }
}
