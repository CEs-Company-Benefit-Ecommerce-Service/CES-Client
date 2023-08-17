import { BaseResponse, Category, CategoryPayload, Params } from 'src/@types/@ces'
import axiosClient from './axiosClient'

export const categoryApi = {
  getAll(params: Partial<Params>): Promise<BaseResponse<Category[]>> {
    return axiosClient.get('/category', { params })
  },
  getById(id: string) {
    return axiosClient.get(`/category/${id}`)
  },
  getAllBySupplierId(params: Partial<Params>): Promise<BaseResponse<Category[]>> {
    return axiosClient.get(`/category`, { params })
  },
  create: async (payload: CategoryPayload) => await axiosClient.post('/category', payload),
  delete: async (id: number) => await axiosClient.delete(`/category/${id}`),
  update: async (id: string, payload: CategoryPayload) =>
    await axiosClient.put(`/category/${id}`, payload),
}
