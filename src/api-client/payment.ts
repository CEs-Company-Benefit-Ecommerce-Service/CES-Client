import { AxiosResponse } from 'axios'
import {
  BaseResponse,
  MonthlyOrder,
  Params,
  PaymentPayload,
  TransactionHistory,
  TransactionPayload,
  TransactionUpdatePayload,
} from 'src/@types/@ces'
import axiosClient from './axiosClient'

export const paymentApi = {
  pay: (payload: PaymentPayload) => axiosClient.post(`/payment`, payload),
  eatransaction: (params: Partial<Params>): Promise<BaseResponse<TransactionHistory[]>> =>
    axiosClient.get(`/transaction`, { params }),
  satransaction: (params: Partial<Params>): Promise<BaseResponse<TransactionHistory[]>> =>
    axiosClient.get(`/transaction`, { params }),
  orders: (companyId: string, params: Partial<Params>): Promise<BaseResponse<MonthlyOrder>> =>
    axiosClient.get(`/payment/total-order/${companyId}`, { params }),
  reset: (payload: { companyId: string }) =>
    axiosClient.post(`/wallet/reset/employee-wallet/${payload.companyId}`, payload),

  createPaymentDebt: async (payload: TransactionPayload) =>
    await axiosClient.post('/transaction', payload),
  updateDebt: async (id: string, payload: TransactionUpdatePayload) =>
    await axiosClient.put(`/transaction/${id}`, payload),
}
