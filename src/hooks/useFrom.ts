import { useImmer } from 'use-immer'

type Target<T> = { target: T }
type ValueElement = { value?: string }
type CheckElement = { checked: boolean }

export function useForm<T>(initialValue: T) {
  const [form, setForm] = useImmer(initialValue)

  function onValueChange<K extends keyof T>(name: K) {
    return (e: Target<ValueElement>) => {
      setForm((draft: any) => {
        draft[name] = e.target.value?.trim()
      })
    }
  }

  function onCheckChange<K extends keyof T>(name: K) {
    return (e: Target<CheckElement>) => {
      setForm((draft: any) => {
        draft[name] = e.target.checked
      })
    }
  }

  return { form, setForm, onValueChange, onCheckChange }
}
