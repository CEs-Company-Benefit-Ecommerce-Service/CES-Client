export type ProjectData = {
  id: string
  name: string
  address: string
  updatedAt: string | null
  createdAt: string | null
  status: number
  imageUrl: string
  companyId: number
  employeeGroupMappings: {
    id: string
    employeeId: string
    groupId: string
    createdAt: string
    updatedAt: string
    employee: {
      id: string
      companyId: 2
      accountId: string
      status: 1
      createdAt: string
      updatedAt: string
      account: any
      company: any
      employeeGroupMappings: any[]
      orders: any[]
    }
    group: {
      id: string
      name: string
      status: number
      imageUrl: string
      description: string
      createdAt: string
      updatedAt: string
      createdBy: string
      updatedBy: any
      companyId: number
      company: any
      employeeGroupMappings: any[]
    }
  }[]
}

export type ProjectPayload = {
  name: string
  address: string
  status?: number
  imageUrl: string
}

export type AddProjectMemberPayload = {
  groupId: string
  accountId: string[]
}

export enum ProjectStatus {
  'Active' = 1,
  'In Active' = 2,
  'Delete' = 3,
}

const filterStatusOptions = (filterFn: (value: ProjectStatus) => boolean) =>
  Object.entries(ProjectStatus)
    .filter(([_, value]) => typeof value === 'number' && filterFn(value))
    .map(([key, value]) => ({ code: value as number, label: key }))

export const PROJECT_STATUS_OPTIONS = [
  { code: 'all', label: 'All' },
  ...filterStatusOptions(() => true),
]

export const PROJECT_STATUS_OPTIONS_FORM = filterStatusOptions((value) =>
  [ProjectStatus['Active'], ProjectStatus['Delete'], ProjectStatus['In Active']].includes(value)
)
