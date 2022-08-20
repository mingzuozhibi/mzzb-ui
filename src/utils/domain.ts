import md5 from 'md5'

export function isJustUpdated(time?: number) {
  return time && Date.now() - time < 3600000 // 1.0 hour
}

export function isSlowUpdated(time?: number) {
  return time && Date.now() - time > 21960000 // 6.1 hour
}

export function isEmpty(text?: string): text is undefined {
  return text === undefined || text.length === 0
}

export function encodePassword(username: string, password: string) {
  return md5(username + md5(password))
}
