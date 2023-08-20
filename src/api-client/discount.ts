import { BaseResponse, Params } from 'src/@types/@ces'
import axiosClient from './axiosClient'
import { DiscountData, DiscountPayload } from 'src/@types/@ces/discount'

interface DiscountParams extends Params {
  productId: string
}

export const discountApi = {
  getAll(params: Partial<DiscountParams>): Promise<BaseResponse<DiscountData[]>> {
    return axiosClient.get(`/discount`, { params })
  },
  getById(id: string): Promise<BaseResponse<DiscountData>> {
    return axiosClient.get(`/discount/${id}`)
  },
  create(payload: DiscountPayload) {
    return axiosClient.post('/discount', payload)
  },
  update(id: string, payload: DiscountPayload) {
    return axiosClient.put(`/discount/${id}`, payload)
  },
  delete(id: string) {
    return axiosClient.delete(`/discount/${id}`)
  },
}
