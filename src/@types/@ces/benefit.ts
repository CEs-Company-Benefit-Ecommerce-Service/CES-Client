import { CompanyData } from './company'

export type BenefitData = {
  id: string
  name: string
  description: string
  type: number
  unitPrice: number
  status: number
  companyId: number
  company: CompanyData
  createdAt: string
  updatedAt: string
  groups: {
    id: string
    name: string
    status: number
    imageUrl: string
    description: string
    createdAt: string
    updatedAt: string
    createdBy: string
    updatedBy: string
    benefitId: string
    type: number
    timeFilter: number
    dateFilter: number
    dayFilter: number
    endDate: string
    benefit: any
    employeeGroupMappings: {
      id: string
      employeeId: string
      groupId: string
      createdAt: string
      updatedAt: string
      isReceived: boolean
      employee: any
      group: any
    }[]
  }[]
}

export type BenefitPayload = {
  name: string
  description: string
  unitPrice: number
  type: number
  timePicker?: any
  timeFilter: number | null
  dateFilter: number | null
  dayFilter: number | null
  endDate: string | null | Date
  status?: any
}
