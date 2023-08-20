export type DiscountData = {
  id: number
  type: number
  amount: number
  imageUrl: string
  expiredDate: string
  status: number
  createdAt: string
  updatedAt: string
  productId: string
}

export type DiscountPayload = {
  type: number
  amount: number
  imageUrl: string
  expiredDate: string | Date | null
  productId: string
}
