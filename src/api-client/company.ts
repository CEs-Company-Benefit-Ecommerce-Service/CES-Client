import { CompanyData, CompanyPayload, BaseResponse, Params } from 'src/@types/@ces'
import axiosClient from './axiosClient'

export const companyApi = {
  getAll(params: Partial<Params>): Promise<BaseResponse<CompanyData[]>> {
    return axiosClient.get(`/company`, { params })
  },
  getById(id: string) {
    return axiosClient.get(`/company/${id}`)
  },
  create: async (payload: CompanyPayload) => await axiosClient.post('/company', payload),
  // delete(id: string) {
  //   return axiosClient.delete(`/company/${id}`)
  // },
  update(id: string, payload: CompanyPayload) {
    return axiosClient.put(`/company/${id}`, payload)
  },
}
