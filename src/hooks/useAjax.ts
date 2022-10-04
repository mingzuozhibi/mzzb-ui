import { IPage } from '#T/result'
import { safeWarpper } from '#U/domain'
import { fetchResult } from '#U/fetch/fetchResult'
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
        successText: `${title}成功`,
        failureName: `${title}失败`,
      })
        .then((result) => onSuccess(result.data!, result.page))
        .finally(() => setLoading(false))
    },
    [setLoading]
  )

  return [loading, doAjax] as [boolean, (url: string, title: string, options: Options<T>) => void]
}
