import { safeWarpper } from '#U/domain'
import { fetchResult } from '#U/fetch/fetchResult'
import { useState } from 'react'

interface Options<T> {
  body?: any
  onSuccess: (data: T) => void
}

export function useAjax<T>(method: 'get' | 'put' | 'post' | 'delete') {
  const [loading, setLoading] = useState(false)

  function doAjax(url: string, title: string, { body, onSuccess }: Options<T>) {
    setLoading(true)
    fetchResult<T>(url, {
      method,
      body: safeWarpper(body, JSON.stringify),
      successText: `${title}成功`,
      failureName: `${title}失败`,
    })
      .then((result) => onSuccess(result.data!))
      .finally(() => setLoading(false))
  }

  return [loading, doAjax] as [boolean, (url: string, title: string, options: Options<T>) => void]
}
