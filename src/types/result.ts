export interface IPage {
  pageSize: number
  currentPage: number
  totalElements: number
}

export interface ILoad {
  loading: boolean
  refresh: () => void
}
