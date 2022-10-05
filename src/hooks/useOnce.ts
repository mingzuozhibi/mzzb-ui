import { useRequest } from 'ahooks'
import { useEffect, useRef } from 'react'

import { Service, Options, Plugin, Result } from 'ahooks/lib/useRequest/src/types'

export function useOnceService(service: () => void) {
  const ref = useRef(true)
  useEffect(() => {
    if (ref.current) {
      ref.current = false
      service()
    }
  })
}

interface ExtOptions {
  autoScroll?: boolean
}

export const useOnceRequest = <T, P extends any[]>(
  service: Service<T, P>,
  options?: Options<T, P> & ExtOptions,
  plugins?: Plugin<T, P>[]
): Result<T, P> => {
  const defaults: Options<T, P> = {
    debounceWait: 50,
  }
  const override: Options<T, P> = {}
  if (options?.autoScroll === true) {
    override.onSuccess = (data, params) => {
      options.onSuccess?.(data, params)
      window.scroll(0, 0)
    }
  }
  return useRequest(service, { ...defaults, ...options, ...override }, plugins)
}
