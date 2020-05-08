import { useEffect, useReducer, useState, useCallback, useMemo } from 'react'
import { Handler, State } from '../@domain'
import request from '../funcs/request'

export type UseData<T> = [State<T>, Handler]

export function useData<T>(url: string, initialState: State<T> = {}) {
  const [loading, setLoading] = useState(true)
  const [state, dispatch] = useReducer((prevState: State<T>, action: any) => {
    switch (action.type) {
      case 'Receive':
        return { data: action.data, page: action.page }
      case 'Message':
        return { error: action.error }
      default:
        return prevState
    }
  }, initialState)

  const refresh = useCallback(() => {
    setLoading(true)
    request(url).then((result) => {
      setLoading(false)
      if (result.success) {
        dispatch({ type: 'Receive', data: result.data, page: result.page })
      } else {
        dispatch({ type: 'Message', error: result.message })
      }
    })
  }, [url, setLoading, dispatch])

  useEffect(refresh, [refresh])

  const handler = useMemo(() => ({ loading, refresh }), [loading, refresh])

  return [state, handler] as UseData<T>
}
