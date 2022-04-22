import { Handler, Page } from '##/@domain'
import { request } from '#F/request'
import { message, Modal } from 'antd'
import produce from 'immer'
import { useEffect, useReducer, useState } from 'react'

interface State<T> {
  data?: T
  page?: Page
  error?: string
}

interface ModifyMethod<T> {
  doEdit: (url: string, form: any) => void
  setter: (state: T) => void
  update: (recipe: (draft: T) => void) => void
}

export type UseData<T> = [State<T>, Handler, ModifyMethod<T>]

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
      case 'Modified':
        return { data: action.data }
      default:
        return prevState
    }
  }, initialState)

  useEffect(refresh, [url, dispatch])

  function refresh() {
    setLoading(true)
    request(url).then((result) => {
      if (result.success) {
        dispatch({ type: 'Receive', data: result.data, page: result.page })
      } else {
        dispatch({ type: 'Message', error: result.message })
      }
    })
  }

  function doEdit(url: string, form: any) {
    setLoading(true)
    request(url, { method: 'put', body: JSON.stringify(form) }).then((result) => {
      setLoading(false)
      if (result.success) {
        message.success('提交修改成功')
        setter(result.data)
      } else {
        Modal.error({ title: '提交修改失败', content: result.message })
      }
    })
  }

  function setter(data: T) {
    if (data !== undefined) {
      dispatch({ type: 'Modified', data })
    }
  }

  function update(recipe: (draft: T) => void) {
    if (state.data !== undefined) {
      setter(produce(state.data as T, recipe))
    }
  }

  return [state, { loading, refresh }, { doEdit, setter, update }] as UseData<T>
}
