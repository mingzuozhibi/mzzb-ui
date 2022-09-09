type HasLength = { length: number }
type TCallback<T, R> = (t: T) => R

export function isEmpty(text?: HasLength): text is undefined {
  return text == null || text.length === 0
}

export function emptyWarpper<T extends HasLength, R>(t: T | undefined, callback: TCallback<T, R>) {
  if (t != undefined && t.length > 0) {
    return callback(t)
  } else {
    return undefined
  }
}

export function safeWarpper<T, R>(t: T | undefined, callback: TCallback<T, R>) {
  if (t != undefined) {
    return callback(t)
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
