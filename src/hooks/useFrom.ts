import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { Draft } from 'immer'
import { ChangeEvent } from 'react'
import { useImmer } from 'use-immer'

type ValueElement = HTMLInputElement

export function useForm<T>(initialValue: T) {
  const [form, setForm] = useImmer(initialValue)

  function onChange(updater: (draft: Draft<T>, value: string) => void) {
    return (e: ChangeEvent<ValueElement>) => {
      setForm((draft) => {
        updater(draft, e.target.value.trim())
      })
    }
  }

  function onSelect(updater: (draft: Draft<T>, checked: boolean) => void) {
    return (e: CheckboxChangeEvent) => {
      setForm((draft) => {
        updater(draft, e.target.checked)
      })
    }
  }

  return { form, onChange, onSelect }
}
