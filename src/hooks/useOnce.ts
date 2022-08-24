import { useRequest } from 'ahooks'
import { useEffect, useRef } from 'react'

export function useOnceService(service: () => void) {
  const ref = useRef(true)
  useEffect(() => {
    if (ref.current) {
      ref.current = false
      service()
    }
  })
}

type UseRequest = typeof useRequest

export const useOnceRequest: UseRequest = (service, options, plugins) => {
  const myOptions: typeof options = {
    debounceWait: 50,
    ...options,
  }
  return useRequest(service, myOptions, plugins)
}
