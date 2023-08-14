import { Params } from 'src/@types/@ces'
import { orderApi } from 'src/api-client/order'
import useSWR, { SWRConfiguration } from 'swr'

type UseOrderProps = {
  params?: Partial<Params>
  options?: SWRConfiguration
  id?: string
  companyId?: string
  enable?: boolean
  supplierId?: string
}
export function useOrder({ params, options }: UseOrderProps) {
  const { data, error, mutate, isLoading, isValidating } = useSWR(
    ['/order-list', params],
    () => orderApi.getAll(params!),
    {
      shouldRetryOnError: true,
      keepPreviousData: true,
      revalidateOnFocus: true,
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

export function useOrderBySupplierId({ params, options, supplierId }: UseOrderProps) {
  const { data, error, mutate, isLoading, isValidating } = useSWR(
    ['/orderSupId', params],
    () => orderApi.getAllBySupplierId(params!, supplierId!),
    {
      shouldRetryOnError: true,
      keepPreviousData: true,
      revalidateOnFocus: true,
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
export function useOrderCompId({ params, options, companyId }: UseOrderProps) {
  const { data, error, mutate, isLoading, isValidating } = useSWR(
    ['/orderCompId', params],
    () => orderApi.getAllByCompId(params!, companyId!),
    {
      shouldRetryOnError: true,
      refreshInterval: 5000,
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

export function useOrderCompIdEa({ params, options, companyId }: UseOrderProps) {
  const { data, error, mutate, isLoading, isValidating } = useSWR(
    ['/orderCompIdEa', params],
    () => orderApi.getAllByCompIdEa(params!, companyId!),
    {
      shouldRetryOnError: true,
      refreshInterval: 5000,
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

export function useOrderDetail({ id, options, enable = true }: UseOrderProps) {
  const { data, error, mutate, isLoading, isValidating } = useSWR(
    enable ? ['order-detail', id] : null,
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
