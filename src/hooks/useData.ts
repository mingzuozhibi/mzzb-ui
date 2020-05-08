import { useEffect, useReducer, useState, useCallback, useMemo } from 'react'
import { Handler, Page } from '../reducers/@domain'
import request from '../funcs/request'

export interface State<T> {
  data?: T
  page?: Page
  error?: string
}

export type UseData<T> = [State<T>, Handler]

export function useData<T>(url: string, initialState: State<T> = {}) {
  const [loading, setLoading] = useState(true)
  const [state, dispatch] = useReducer((prevState: State<T>, action: any) => {
    switch (action.type) {
      case 'Receive':
        setLoading(false)
        return { data: action.data, page: action.page }
      case 'Message':
        setLoading(false)
        return { error: action.error }
      default:
        return prevState
    }
  }, initialState)

  const refresh = useCallback(() => {
    setLoading(true)
    request(url).then((result) => {
      if (result.success) {
        dispatch({ type: 'Receive', data: result.data, page: result.page })
      } else {
        dispatch({ type: 'Message', error: result.message })
      }
    })
  }, [url, setLoading, dispatch])

  useEffect(refresh, [url, refresh])

  const handler = useMemo(() => ({ loading, refresh }), [loading, refresh])

  return [state, handler] as UseData<T>
}
