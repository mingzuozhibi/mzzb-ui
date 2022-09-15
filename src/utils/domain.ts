type HasLength = { length: number }
type TCallback<T, R> = (t: T) => R

export function isEmpty(value?: HasLength): value is undefined {
  return value == null || value.length === 0
}

export function emptyWarpper<T extends HasLength, R>(
  value: T | undefined,
  callback: TCallback<T, R>
) {
  if (value != null && value.length > 0) {
    return callback(value)
  } else {
    return undefined
  }
}

export function safeWarpper<T, R>(value: T | undefined, callback: TCallback<T, R>) {
  if (value != null) {
    return callback(value)
  } else {
    return undefined
  }
}

export function testWarpper<R>(test: boolean, callback: () => R) {
  if (test) {
    return callback()
  } else {
    return undefined
  }
}
