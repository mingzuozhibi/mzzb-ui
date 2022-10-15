import useUrlState, { Options } from '@ahooksjs/use-url-state'

interface ExtOptions<T> {
  arrayNames?: string[]
  numberNames?: string[]
  booleanNames?: string[]
}

export function useSearch<T>(initialState?: T, options?: Options & ExtOptions<T>) {
  const { arrayNames, numberNames, booleanNames, ...tail } = options ?? {}
  const [urlState, setUrlState] = useUrlState<any>(initialState, {
    navigateMode: 'replace',
    ...tail,
  })

  const state = { ...urlState }
  arrayNames?.forEach((name) => {
    const value = state[name]
    if (value == null) state[name] = []
    state[name] = Array.isArray(value) ? value : [value]
  })
  numberNames?.forEach((name) => {
    const value = state[name]
    if (value == null) return
    state[name] = typeof value === 'string' ? parseInt(value) : value
  })
  booleanNames?.forEach((name) => {
    const value = state[name]
    if (value == null) return
    state[name] = typeof value === 'string' ? value === 'true' : value
  })

  return [state, setUrlState] as const
}
