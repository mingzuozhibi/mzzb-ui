type TCallback<T, R> = (t: T) => R

export function isEmpty(value?: any): value is undefined {
  return value == null || value.length === 0
}

export function safeWarpper<T, R>(value: T | undefined, callback: TCallback<T, R>) {
  return isEmpty(value) ? undefined : callback(value)
}
