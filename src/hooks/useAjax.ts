import { useState } from 'react'
import request from '../funcs/request'
import { Modal } from 'antd'

export function useAjax(method: 'post' | 'delete') {
  const [loading, setLoading] = useState(false)

  function sendAjax(url: string, form: any, onSuccess: () => void) {
    setLoading(true)
    request(url, {method, body: JSON.stringify(form)}).then(result => {
      setLoading(false)
      if (result.success) {
        onSuccess()
      } else {
        Modal.error({title: '提交保存失败', content: result.message})
      }
    })
  }

  return {loading, sendAjax}
}
