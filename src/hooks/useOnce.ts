import { useRequest } from 'ahooks'
import { useEffect, useRef } from 'react'

import { Service, Options, Plugin, Result } from 'ahooks/lib/useRequest/src/types'
import { fetchData, fetchResult } from '#U/fetch/fetchResult'
import { IResult } from '#T/result'

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

export function useOnceRequest<T, P extends any[]>(
  service: Service<T, P>,
  options?: Options<T, P> & ExtOptions,
  plugins?: Plugin<T, P>[]
): Result<T, P> {
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

export function useResult<T>(
  apiUrl: string,
  options?: Options<IResult<T>, []> & ExtOptions,
  plugins?: Plugin<IResult<T>, []>[]
): Result<IResult<T>, []> {
  const defaults: Options<IResult<T>, []> = {
    loadingDelay: 300,
    cacheKey: apiUrl,
  }
  return useOnceRequest(() => fetchResult<T>(apiUrl), { ...defaults, ...options }, plugins)
}

export function useData<T>(
  apiUrl: string,
  options?: Options<T | undefined, []> & ExtOptions,
  plugins?: Plugin<T | undefined, []>[]
): Result<T | undefined, []> {
  const defaults: Options<T | undefined, []> = {
    loadingDelay: 300,
    cacheKey: apiUrl,
  }
  return useOnceRequest(() => fetchData<T>(apiUrl), { ...defaults, ...options }, plugins)
}
