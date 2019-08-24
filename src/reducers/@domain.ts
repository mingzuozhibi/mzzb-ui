export interface Page {
  pageSize: number
  currentPage: number
  totalElements: number
}

export interface Handler {
  loading: boolean
  refresh: () => void
}
