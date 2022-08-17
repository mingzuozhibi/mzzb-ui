import { useState } from 'react'

export function useLocal<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    const value = localStorage.getItem(key)
    return JSON.parse(value ?? 'null') ?? initial
  })
  const setLocal = (value: T) => {
    setState(value)
    localStorage.setItem(key, JSON.stringify(value))
  }
  return [state, setLocal] as const
}
