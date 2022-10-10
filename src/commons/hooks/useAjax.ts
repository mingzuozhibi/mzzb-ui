import { safeWarpper } from '#CU/empty'
import { fetchResult } from '#CU/fetch'
import { IPage } from '#DT/result'
import { useCallback, useState } from 'react'

interface Options<T> {
  body?: any
  onSuccess: (data: T, page?: IPage) => void
}

export function useAjax<T>(method: 'get' | 'put' | 'post' | 'patch' | 'delete') {
  const [loading, setLoading] = useState(false)

  const doAjax = useCallback(
    (url: string, title: string, { body, onSuccess }: Options<T>) => {
      setLoading(true)
      fetchResult<T>(url, {
        method: method.toLocaleUpperCase(),
        body: safeWarpper(body, JSON.stringify),
        successText: title ? `${title}成功` : undefined,
        failureName: title ? `${title}失败` : undefined,
      })
        .then((result) => onSuccess(result.data!, result.page))
        .finally(() => setLoading(false))
    },
    [setLoading]
  )

  return [loading, doAjax] as [boolean, (url: string, title: string, options: Options<T>) => void]
}
