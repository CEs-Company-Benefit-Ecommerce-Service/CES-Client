export type PaymentPayload = {
  used?: number
  accountId: string
  paymentid: string
}

export type TransactionHistory = {
  id: string
  total: number
  description: string
  type: number
  companyName: string
  createdAt: string
  senderId: string
  recieveId: string
  orderId: null
  walletId: string
  companyId: number
  paymentProviderId: string
  invoiceId: string
  status: number
}

export type TransactionPayload = {
  total: number
  imageUrl: string
}
