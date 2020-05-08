export interface State<T> {
  data?: T
  page?: Page
  error?: string
}

export interface Handler {
  loading: boolean
  refresh: () => void
}

export interface Page {
  pageSize: number
  currentPage: number
  totalElements: number
}

type SuccessResult = { success: true, data: any, page?: Page }
type FailureResult = { success: false, message: string }

export type Result = SuccessResult | FailureResult
