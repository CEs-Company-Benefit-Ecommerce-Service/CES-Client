export type Debt = {
  id: string
  name: string
  total: number
  status: number
  infoPayment: string
  createdAt: string
  updatedAt: string
  companyId: string
  company: Company
  imageUrl: string
  invoiceId: string
}

export type Company = {
  id: number
  name: string
  address: string
  contactPersonId: string
  status: number
  updatedAt: string
  createdAt: string
  imageUrl: string
  contactPerson: string
  phone: string
  limits: number
  used: number
  expiredDate: string
}

export enum DebtStatus {
  NEW = 'New',
  COMPLETE = 'Complete',
  CANCEL = 'Cancel',
  PROGRESSING = 'Progressing',
}
