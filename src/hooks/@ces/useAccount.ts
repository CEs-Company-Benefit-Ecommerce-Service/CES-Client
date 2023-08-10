import { Params } from 'src/@types/@ces'
import { accountApi } from 'src/api-client'
import useSWR, { SWRConfiguration } from 'swr'

type UseAccountProps = {
  params?: Partial<Params>
  options?: SWRConfiguration
  id?: string
  roleId?: string
  enable?: boolean
}

export function useAccountEmployeeCompany({ options, params }: UseAccountProps) {
  const { data, error, mutate, isValidating, isLoading } = useSWR(
    ['account-employee-company-list', params],
    () => accountApi.getAllEmployeeWithCompanyId(params!),
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
    mutate,
    isValidating,
    isLoading,
  }
}

export function useAccountList({ options, params }: UseAccountProps) {
  const { data, error, mutate, isValidating, isLoading } = useSWR(
    ['account-list', params],
    () => accountApi.getAll(params!),
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
    mutate,
    isValidating,
    isLoading,
    // create,
    // update,
  }
}

export function useAccountListByRoleId({ options, params, roleId }: UseAccountProps) {
  const { data, error, mutate, isValidating, isLoading } = useSWR(
    ['account-list-by-roleId', params],
    () => accountApi.getAllByRoleId(roleId!, params!),
    {
      keepPreviousData: true,
      revalidateOnFocus: true,
      // dedupingInterval: 10 * 1000, // 10s
      // revalidateOnFocus: false,
      // keepPreviousData: true,
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
    isValidating,
    isLoading,
  }
}

export function useAccountDetails({ enable = true, id, options }: UseAccountProps) {
  const { data, error, mutate } = useSWR(
    enable ? ['account', id] : null,
    () => accountApi.getById(id!),
    {
      ...options,
    }
  )

  return {
    data,
    error,
    mutate,
  }
}
