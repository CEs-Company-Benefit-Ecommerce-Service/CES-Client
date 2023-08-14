import { Order } from './order'
import { TransactionHistory } from './payment'

export type NotificationData = {
  id: string
  description: string
  title: string
  isRead: boolean
  createdAt: string
  updatedAt: string
  orderId: string
  transactionId: string
  accountId: string
  accountName: string
  order: Order | null
  transaction: TransactionHistory | null
}
