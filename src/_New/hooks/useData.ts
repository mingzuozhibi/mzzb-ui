import { useEffect, useReducer, useState } from 'react'
import { Handler } from '../comps/table/Table'
import request from '../../utils/request'

export interface Page {
  pageSize: number
  currentPage: number
  totalElements: number
}

export interface State<T> {
  data?: T
  page?: Page
  error?: string
}

export function useData<T>(url: string, initialState: State<T> = {}) {
  const [loading, setLoading] = useState(true)
  const [state, dispatch] = useReducer((prevState: State<T>, action) => {
    switch (action.type) {
      case 'Receive':
        setLoading(false)
        return {data: action.data, page: action.page}
      case 'Message':
        setLoading(false)
        return {error: action.error}
      case 'Modified':
        return {data: action.data}
      default:
        return prevState
    }
  }, initialState)

  useEffect(refresh, [url, dispatch])

  function refresh() {
    setLoading(true)
    request(url).then((result) => {
      if (result.success) {
        dispatch({type: 'Receive', data: result.data, page: result.page})
      } else {
        dispatch({type: 'Message', error: result.message})
      }
    })
  }

  function setState(state: T) {
    dispatch({type: 'Modified', data: state})
  }

  return [state, {loading, refresh}, setState] as [State<T>, Handler, (state: T) => void]
}
