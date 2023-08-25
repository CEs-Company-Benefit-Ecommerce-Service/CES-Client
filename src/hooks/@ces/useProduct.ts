import { Params } from 'src/@types/@ces'
import { productApi } from 'src/api-client/product'
import useSWR, { SWRConfiguration } from 'swr'

type UseProductProps = {
  params?: Partial<Params>
  options?: SWRConfiguration
  id?: string
  supplierId?: string
  enable?: boolean
}
export function useProduct({ params, options }: UseProductProps) {
  const { data, error, mutate, isLoading, isValidating } = useSWR(
    ['/product', params],
    () => productApi.getAll(params!),
    {
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

export function useProductBySupplierId({
  params,
  options,
  supplierId,
  enable = false,
}: UseProductProps) {
  const { data, error, mutate, isLoading, isValidating } = useSWR(
    enable ? ['/product-supplierId', params] : null,
    () => productApi.getBySupplierId(supplierId!, params!),
    {
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

export function useProductDetail({ id, options }: UseProductProps) {
  const { data, error, mutate, isLoading } = useSWR(
    ['product-detail', id],
    () => productApi.getById(id!),
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
    error,
    mutate,
    isLoading,
  }
}
