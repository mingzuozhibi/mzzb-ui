import { useDebounceEffect, useRequest } from 'ahooks'

export function useOnceService(service: () => void) {
  useDebounceEffect(service, [service], {
    wait: 50,
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
