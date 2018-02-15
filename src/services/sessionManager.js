import request from '../utils/request'
import md5 from 'md5'

export default {
  current() {
    return request('/api/session')
  },
  login(username, password) {
    password = md5(username + md5(password))
    return request('/api/session/login', {
      method: 'post',
      body: {username, password},
    })
  },
  logout() {
    return request('/api/session/logout', {
      method: 'post',
    })
  },
}
