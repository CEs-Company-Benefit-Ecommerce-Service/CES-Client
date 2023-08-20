import { Category } from './category'

export type ProductData = {
  id: string
  name: string
  price: number
  quantity: number
  unitPrice: number
  preDiscount: number
  description: string
  imageUrl: string
  status: number
  createdAt: string
  updatedAt: string
  categoryId: number
  supplierId: string
  category: Category
  supplier: any
}

export type ProductPayload = {
  name: string
  price: number
  imageUrl: string
  quantity: number
  description: string
  status: number
  categoryId: number
}
