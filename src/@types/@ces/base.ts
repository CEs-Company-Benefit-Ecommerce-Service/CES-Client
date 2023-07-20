export type BaseResponse<T> = {
  code?: number
  message?: string
  metaData?: any
  data?: T
}

export type Params = {
  Page: number
  Size: number
  Sort: string
  Order: string
}

export type Paging = {
  Page: number
  Size: number
}
