import useUrlState, { Options } from '@ahooksjs/use-url-state'

interface ExtOptions<T> {
  arrayNames?: string[]
}

export function useSearch<T>(initialState?: T, options?: Options & ExtOptions<T>) {
  const { arrayNames, ...tail } = options ?? {}
  const [urlState, setUrlState] = useUrlState<any>(initialState, tail)
  const state = { ...urlState }
  arrayNames?.forEach((name) => {
    const value = state[name as string]
    if (value == null) return []
    return Array.isArray(value) ? value : [value]
  })
  return [state, setUrlState] as const
}
