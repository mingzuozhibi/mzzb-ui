import { useState } from 'react'

const setLocal = localStorage.setItem.bind(localStorage)
const getLocal = localStorage.getItem.bind(localStorage)

export function useLocal<T>(key: string, initial: T) {
  return useStorage(`local-${key}`, initial, setLocal, getLocal)
}

const setSession = sessionStorage.setItem.bind(sessionStorage)
const getSession = sessionStorage.getItem.bind(sessionStorage)

export function useSession<T>(key: string, initial: T) {
  return useStorage(`session-${key}`, initial, setSession, getSession)
}

export function useStorage<T>(
  key: string,
  initial: T,
  setItem: (key: string, value: string) => void,
  getItem: (key: string) => string | null
) {
  const [state, setState] = useState<T>(() => {
    const value = getItem(key)
    return JSON.parse(value ?? 'null') ?? initial
  })
  const setValue = (value: T) => {
    setState(value)
    setItem(key, JSON.stringify(value))
  }
  return [state, setValue] as const
}
