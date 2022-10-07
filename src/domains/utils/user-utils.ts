import md5 from 'md5'

export function encodePassword(username: string, password: string) {
  return md5(username + md5(password))
}
