import request from './request'
import md5 from 'md5'

export const md5Password = (username: string, password: string) => {
  return md5(username + md5(password))
}

export const sessionManager = {
  query: () => {
    const token = localStorage['X-AUTO-LOGIN']
    if (token && token.length === 36) {
      return request('/api/session', {
        headers: {
          'X-AUTO-LOGIN': token
        }
      })
    } else {
      return request('/api/session')
    }
  },
  login: (username: string, password: string) => {
    password = md5Password(username, password)
    return request('/api/session', {
      method: 'post',
      body: JSON.stringify({username, password}),
    })
  },
  logout: () => {
    return request('/api/session', {
      method: 'delete',
    })
  },
}
