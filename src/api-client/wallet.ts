import axiosClient from './axiosClient'

export const walletApi = {
  getAll() {},

  getById(id: string) {
    return axiosClient.get(`/wallet/${id}`)
  },

  getByAccountId(id: string) {
    return axiosClient.get(`/wallet/account/${id}`)
  },

  create(payload: any) {
    return axiosClient.post('/wallet', payload)
  },

  updateInfo(id: string, payload: any) {
    return axiosClient.put(`/wallet/${id}`, payload)
  },
  // updateBalance(id: string, payload: any) {
  //   return axiosClient.put(`/wallet/${id}`, payload)
  // },
}
