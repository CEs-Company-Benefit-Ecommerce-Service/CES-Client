import { BaseResponse, NotificationData, Params } from 'src/@types/@ces'
import axiosClient from './axiosClient'

export const notificationApi = {
  getAll(params: Partial<Params>): Promise<BaseResponse<NotificationData[]>> {
    return axiosClient.get(`/login/me/notification`, { params })
  },
  getById(id: string): Promise<BaseResponse<NotificationData>> {
    return axiosClient.get(`/login/me/notification/${id}`)
  },
  readAll(): Promise<BaseResponse<NotificationData[]>> {
    return axiosClient.get(`/login/me/notification/read-all`)
  },
}
