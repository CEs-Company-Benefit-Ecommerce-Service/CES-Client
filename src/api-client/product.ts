import { BaseResponse, Params } from 'src/@types/@ces'
import { ProductData, ProductPayload } from 'src/@types/@ces/product'
import axiosClient from './axiosClient'

export const productApi = {
  getAll(params: Partial<Params>): Promise<BaseResponse<ProductData[]>> {
    return axiosClient.get('/product', { params })
  },
  getById(id: string) {
    return axiosClient.get(`/product/${id}`)
  },
  getBySupplierId(
    supplierId: string,
    params: Partial<Params>
  ): Promise<BaseResponse<ProductData[]>> {
    return axiosClient.get(`/product?SupplierId=${supplierId}`, { params })
  },
  create: async (payload: ProductPayload) => await axiosClient.post('/product', payload),
  delete: async (id: string) => await axiosClient.delete(`/product/${id}`),
  update: async (id: string, payload: ProductPayload) =>
    await axiosClient.put(`/product/${id}`, payload),
}
