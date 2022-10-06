export interface IResult<T> {
  success: boolean
  message?: string
  data?: T
  page?: IPage
}
export interface IPage {
  pageSize: number
  currentPage: number
  totalElements: number
}

export interface ILoad {
  loading: boolean
  refresh: () => void
}

export interface IState {
  error?: Error
  loading: boolean
  refresh: () => void
}
