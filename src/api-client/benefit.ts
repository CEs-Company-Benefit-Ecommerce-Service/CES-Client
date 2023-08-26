import { BenefitData, BenefitPayload, BaseResponse, Params } from 'src/@types/@ces'
import axiosClient from './axiosClient'

export const benefitApi = {
  getAll(params: Partial<Params>): Promise<BaseResponse<BenefitData[]>> {
    return axiosClient.get(`/benefit`, { params })
  },
  getById(id: string): Promise<BaseResponse<BenefitData>> {
    return axiosClient.get(`/benefit/${id}`)
  },
  delete(id: string): Promise<any> {
    return axiosClient.delete(`/benefit/${id}`)
  },
  create(payload: BenefitPayload) {
    return axiosClient.post('/benefit', payload)
  },
  update(id: string, payload: BenefitPayload) {
    return axiosClient.put(`/benefit/${id}`, payload)
  },
}
