import { Params } from 'src/@types/@ces'
import { discountApi } from 'src/api-client'
import useSWR, { SWRConfiguration } from 'swr'

type UseBenefitProps = {
  params?: Partial<Params>
  options?: SWRConfiguration
  productId?: string
}

export function useDiscount({ productId, options, params = { Page: 1 } }: UseBenefitProps) {
  const { data, error, mutate, isValidating, isLoading } = useSWR(
    ['discount-list', productId],
    () => discountApi.getAll({ productId }),
    {
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
