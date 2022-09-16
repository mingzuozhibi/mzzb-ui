import { useState } from 'react'

export function useLocal<T>(key: string, initial: T) {
  const localKey = `local-${key}`
  const [state, setState] = useState<T>(() => {
    const value = localStorage.getItem(localKey)
    return JSON.parse(value ?? 'null') ?? initial
  })
  const setLocal = (value: T) => {
    setState(value)
    localStorage.setItem(localKey, JSON.stringify(value))
  }
  return [state, setLocal] as const
}
