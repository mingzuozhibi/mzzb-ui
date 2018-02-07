import request from '../utils/request'

export default {
  check() {
    return request('/api/session')
  },
  login(username, password) {
    return request('/api/session', {
      method: 'post',
      body: {username, password},
    })
  },
  logout() {
    return request('/api/session', {
      method: 'delete',
    })
  },
}
