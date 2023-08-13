import { Params } from 'src/@types/@ces'
import { debtApi } from 'src/api-client/debt'
import useSWR, { SWRConfiguration } from 'swr'

type UseDebtProps = {
  params?: Partial<Params>
  options?: SWRConfiguration
  id?: string
}
export function useDebt({ params = { Page: 1 }, options }: UseDebtProps) {
  const { data, error, mutate, isLoading } = useSWR(
    ['/debt', params],
    () => debtApi.getAll(params!),
    {
      // revalidateOnFocus: false,dERR
      // dedupingInterval: 10 * 1000, // 10s
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
    mutate,
    isLoading,
  }
}

export function useCompanyDebt({ params = { Page: 1 }, options, id }: UseDebtProps) {
  const { data, error, mutate, isLoading } = useSWR(
    ['/order', id],
    () => debtApi.getByCompanyId(id!),
    {
      // revalidateOnFocus: false,dERR
      // dedupingInterval: 10 * 1000, // 10s
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
    mutate,
    isLoading,
  }
}

export function useDebtDetail({ id, options }: UseDebtProps) {
  const { data, error, mutate, isLoading } = useSWR(['debt-detail', id], () => debtApi.getById(id!), {
    keepPreviousData: true,
    fallbackData: {
      code: 0,
      message: '',
      metaData: null,
      data: {},
    },
    ...options,
  })

  return {
    data,
    error,
    mutate,
    isLoading,
  }
}
