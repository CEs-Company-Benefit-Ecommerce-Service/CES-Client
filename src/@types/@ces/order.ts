import { AccountData } from './account'
import { ProductData } from './product'

export type Order = {
  id: string
  total: number
  address: string
  updatedAt: string
  createdAt: string
  status: number
  note: string
  code: string
  orderCode: string
  debtStatus: number
  companyName: string
  employeeId?: string
  employeeName?: string
  employee: Employee
  orderDetails: OrderDetail[]
}

export type MonthlyOrder = {
  total: number

  orders: Order[]
}

export type Employee = {
  account: AccountData
}
export type OrderDetail = {
  price: number
  quantity: number
  createAt: string
  notes: string
  productId: string
  product: ProductData
}
export enum Status {
  '',
  'new',
  'ready',
  'shipping',
  'complete',
  'cancel',
}

export enum UpdateOrderStatus {
  '',
  'new',
  'ready',
}
// export enum DebtStatus {
//   NOTPAYMENT = 'Not Payment',
//   COMPLETE = 'Complete',
//   CANCEL = 'Cancel',
// }
export enum ProductStatus {
  ACTIVE = 'Active',
  INACTIVE = 'InActive',
}
