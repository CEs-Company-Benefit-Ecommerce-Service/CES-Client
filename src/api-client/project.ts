import {
  AddProjectMemberPayload,
  BaseResponse,
  Params,
  ProjectData,
  ProjectPayload,
} from 'src/@types/@ces'
import axiosClient from './axiosClient'

export const projectApi = {
  getAll(params: Partial<Params>): Promise<BaseResponse<ProjectData[]>> {
    return axiosClient.get(`/group`, { params })
  },

  getById(id: string): Promise<BaseResponse<ProjectData>> {
    return axiosClient.get(`/group/${id}`)
  },

  create(payload: ProjectPayload) {
    return axiosClient.post('/group', payload)
  },

  delete(id: string) {
    return axiosClient.delete(`/group/${id}`)
  },

  update(id: string, payload: ProjectPayload) {
    return axiosClient.put(`/group/${id}`, payload)
  },

  addMember(payload: AddProjectMemberPayload) {
    return axiosClient.post(`/group/members`, payload)
  },

  removeMember(payload: AddProjectMemberPayload) {
    return axiosClient.delete(`/group/members/remove`, { data: payload })
  },

  transferMoney(id: string) {
    return axiosClient.post(`/group/${id}/employees`)
  },
}
