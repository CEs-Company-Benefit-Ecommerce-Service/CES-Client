import { Params } from 'src/@types/@ces'
import { accountApi } from 'src/api-client'
import useSWR, { SWRConfiguration } from 'swr'

type UseAccountProps = {
  params?: Partial<Params>
  options?: SWRConfiguration
  id?: string
  roleId?: string
}

export function useAccountList({ options, params }: UseAccountProps) {
  const { data, error, mutate, isValidating, isLoading } = useSWR(
    ['account-list', params],
    () => accountApi.getAll(params!),
    {
      // dedupingInterval: 10 * 1000, // 10s
      // revalidateOnFocus: false,
      // keepPreviousData: true,
      // fallbackData: {
      //   code: 0,
      //   message: '',
      //   metaData: null,
      //   data: [],
      // },
      ...options,
    }
  )

  return {
    data,
    error,
    mutate,
    isValidating,
    isLoading,
    // create,
    // update,
  }
}

export function useAccountListByRoleId({ options, params, roleId }: UseAccountProps) {
  const { data, error, mutate, isValidating, isLoading } = useSWR(
    ['account-list', params],
    () => accountApi.getAllByRoleId(roleId!, params!),
    {
      // dedupingInterval: 10 * 1000, // 10s
      // revalidateOnFocus: false,
      // keepPreviousData: true,
      // fallbackData: {
      //   code: 0,
      //   message: '',
      //   metaData: null,
      //   data: [],
      // },
      ...options,
    }
  )

  return {
    data,
    error,
    mutate,
    isValidating,
    isLoading,
    // create,
    // update,
  }
}

export function useAccountDetails({ id, options }: UseAccountProps) {
  const { data, error, mutate } = useSWR(['account', id], () => accountApi.getById(id!), {
    // keepPreviousData: true,
    // fallbackData: {
    //   code: 0,
    //   message: '',
    //   metaData: null,
    //   data: {},
    // },
    ...options,
  })

  return {
    data,
    error,
    mutate,
  }
}
