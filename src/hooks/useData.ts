import { useEffect, useReducer, useState } from 'react'
import { message, Modal } from 'antd'
import { Handler, Page } from '../reducers/@domain'
import request from '../funcs/request'

interface State<T> {
  data?: T
  page?: Page
  error?: string
}

interface ModifyMethod<T> {
  doEdit: (url: string, form: any) => void
  modify: (state: T) => void
}

export type UseData<T> = [State<T>, Handler, ModifyMethod<T>]

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

  function doEdit(url: string, form: any) {
    setLoading(true)
    request(url, {method: 'put', body: JSON.stringify(form)}).then(result => {
      setLoading(false)
      if (result.success) {
        message.success('提交修改成功')
        modify(result.data)
      } else {
        Modal.error({title: '提交修改失败', content: result.message})
      }
    })
  }

  function modify(data: T) {
    dispatch({type: 'Modified', data})
  }

  return [state, {loading, refresh}, {doEdit, modify}] as UseData<T>
}
