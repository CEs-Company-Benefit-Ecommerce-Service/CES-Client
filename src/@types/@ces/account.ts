import { CompanyData } from './company'
import { WalletData } from './wallet'

export type AccountData = {
  id: string
  name: string
  email: string
  address: string
  phone: string
  imageUrl: string
  status: number
  role: number
  companyId: number
  expiredDate: string
  updatedAt: string
  createdAt: string
  wallets: WalletData[]
  company: CompanyData
  suppliers?: [
    {
      id: string
      companyId: string
      accountId: string
      supplierName: string
      supplierAddress: string
      status: number
      createdAt: string
      updatedAt: string
      account: string
    }
  ]
  isReceived?: boolean
  employees?: [
    {
      id: string
      companyId: string
      accountId: string
      supplierName: string
      supplierAddress: string
      status: number
      createdAt: string
      updatedAt: string
      account: string
    }
  ]
}

export type AccountPayload = {
  name: string
  email: string
  password: string
  phone: string
  address: string
  imageUrl: string | null
  role?: number
  companyId?: number | null
  company?: {
    name?: string
    address?: string
    imageUrl?: string | null
    limits?: number
    expiredDate?: string
  } | null
  status?: number
}

export type ChangePasswordPayload = {
  newPassword: string
  oldPassword: string
}

export enum Role {
  'System Admin' = 1,
  'Supplier Admin' = 2,
  'Enterprise Admin' = 3,
  'Employee' = 4,
  'Shipper' = 5,
}

export function roleNumberToString(value: number): string | undefined {
  const enumKeys = Object.keys(Role).filter((key) => isNaN(Number(key))) as (keyof typeof Role)[]
  const enumValues = enumKeys.map((key) => Role[key])

  const index = enumValues.indexOf(value)
  if (index !== -1) {
    return enumKeys[index]
  }

  return undefined
}

const filterRoleOptions = (filterFn: (value: Role) => boolean) =>
  Object.entries(Role)
    .filter(([_, value]) => typeof value === 'number' && filterFn(value))
    .map(([key, value]) => ({ code: value as number, label: key }))

export const ROLE_OPTIONS_SA = [
  { code: 'all', label: 'All' },
  ...filterRoleOptions((value) =>
    [Role['Supplier Admin'], Role['Enterprise Admin']].includes(value)
  ),
]
export const ROLE_OPTIONS_EA = [
  { code: 'all', label: 'All' },
  ...filterRoleOptions((value) => [Role['Employee']].includes(value)),
]

export const ROLE_OPTIONS_FORM_EA = filterRoleOptions((value) => [Role['Employee']].includes(value))

export const ROLE_OPTIONS_FORM_SA = filterRoleOptions((value) =>
  [Role['Supplier Admin'], Role['Enterprise Admin'], Role['Shipper']].includes(value)
)

export enum AccountStatus {
  'Active' = 1,
  'In Active' = 2,
  'Deleted' = 3,
}

const filterStatusOptions = (filterFn: (value: AccountStatus) => boolean) =>
  Object.entries(AccountStatus)
    .filter(([_, value]) => typeof value === 'number' && filterFn(value))
    .map(([key, value]) => ({ code: value as number, label: key }))

export const ACCOUNT_STATUS_OPTIONS_SA = [
  { code: 'all', label: 'All' },
  ...filterStatusOptions(() => true),
]

export const ACCOUNT_STATUS_OPTIONS_FORM = filterStatusOptions((value) =>
  [AccountStatus['Active'], AccountStatus['In Active']].includes(value)
)
