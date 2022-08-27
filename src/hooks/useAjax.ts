import { request } from '#U/fetch/request'
import { message, Modal } from 'antd'
import { useState } from 'react'

interface Options<T> {
  body?: any
  onSuccess: (data: T) => void
}

export function useAjax<T>(method: 'get' | 'put' | 'post' | 'delete') {
  const [loading, setLoading] = useState(false)

  function doAjax(url: string, title: string, { body, onSuccess }: Options<T>) {
    setLoading(true)
    request<T>(url, { method, body: body && JSON.stringify(body) }).then((result) => {
      setLoading(false)
      if (result.success) {
        message.success(`${title}成功`)
        onSuccess(result.data!)
      } else {
        Modal.error({ title: `${title}失败`, content: result.message })
      }
    })
  }

  return [loading, doAjax] as [boolean, (url: string, title: string, options: Options<T>) => void]
}
