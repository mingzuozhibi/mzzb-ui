import { useEffect, useReducer } from 'react'
import request from '../../utils/request'

export interface Page {
  pageSize: number
  currentPage: number
  totalElements: number
}

export interface State<T> {
  data?: T[]
  page?: Page
  error?: string
}

export function usePagedData<T>(url: string, initialState: State<T> = {}) {
  const [state, dispatch] = useReducer((prevState: State<T>, action) => {
    switch (action.type) {
      case 'Receive':
        return {data: action.data, page: action.page}
      case 'Message':
        return {error: action.error}
      default:
        return prevState
    }
  }, initialState)

  useEffect(refresh, [url, dispatch])

  function refresh() {
    request(url).then((result) => {
      if (result.success) {
        dispatch({type: 'Receive', data: result.data, page: result.page})
      } else {
        dispatch({type: 'Message', error: result.message})
      }
    })
  }

  return [state, refresh] as [State<T>, () => void]
}

