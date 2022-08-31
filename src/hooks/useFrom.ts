import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { ChangeEvent } from 'react'
import { useImmer } from 'use-immer'

type ValueElement = HTMLInputElement

export function useForm<T>(initialValue: T) {
  const [form, setForm] = useImmer(initialValue)

  function onValueChange<K extends keyof T>(name: K) {
    return (e: ChangeEvent<ValueElement>) => {
      setForm((draft: any) => {
        draft[name] = e.target.value.trim()
      })
    }
  }

  function onCheckChange<K extends keyof T>(name: K) {
    return (e: CheckboxChangeEvent) => {
      setForm((draft: any) => {
        draft[name] = e.target.checked
      })
    }
  }

  return { form, onValueChange, onCheckChange }
}
