import { BaseResponse, Params } from 'src/@types/@ces'
import { Debt } from 'src/@types/@ces/debt'
import axiosClient from './axiosClient'

export const debtApi = {
  getAll(params: Partial<Params>): Promise<BaseResponse<Debt[]>> {
    return axiosClient.get('/debtandreceipt/debt', { params })
  },
  getById(id: string) {
    return axiosClient.get(`/transaction/${id}`)
  },
  getByCompanyId(id: string) {
    return axiosClient.get(`/debtandreceipt/debt/company/${id}`)
  },
  create: async (id: string) => await axiosClient.post(`/debtandreceipt/debt?companyId=${id}`),
  delete: async (id: string) => await axiosClient.delete(`/debtandreceipt/debt/${id}`),
}
