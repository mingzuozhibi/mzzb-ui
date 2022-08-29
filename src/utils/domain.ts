import md5 from 'md5'

export function isEmpty(text?: string): text is undefined {
  return text === undefined || text.length === 0
}

export function encodePassword(username: string, password: string) {
  return md5(username + md5(password))
}

export function safeWarpper<T, R>(t: T | undefined, callback: (t: T) => R) {
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
