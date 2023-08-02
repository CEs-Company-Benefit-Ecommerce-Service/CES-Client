import { Params } from 'src/@types/@ces'
import { paymentApi } from 'src/api-client/payment'
import useSWR, { SWRConfiguration } from 'swr'

type UsePaymentProps = {
  params?: Partial<Params>
  options?: SWRConfiguration
  id?: string
  companyId?: string
}
export function usePayment({ params, options, companyId }: UsePaymentProps) {
  const { data, error, mutate, isLoading } = useSWR(
    ['/transaction-wallet', params],
    () => paymentApi.eatransaction(companyId!, params!),
    {
      // revalidateOnFocus: false,
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

export function usePaymentSystem({ params, options, companyId }: UsePaymentProps) {
  const { data, error, mutate, isLoading } = useSWR(
    ['/transaction-wallet', params],
    () => paymentApi.satransaction(params!),
    {
      // revalidateOnFocus: false,
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
export function useOrderByCompanyId({ params, options, companyId }: UsePaymentProps) {
  const { data, error, mutate, isLoading } = useSWR(
    ['/order-wallet', params],
    () => paymentApi.orders(companyId!),
    {
      // revalidateOnFocus: false,
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
