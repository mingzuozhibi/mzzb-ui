import request from '../utils/request'
import md5 from 'md5'

export default {
  findAll() {
    return request('/api/users')
  },
  addUser(username, password) {
    password = md5(username + md5(password))
    return request('/api/users', {
      method: 'post',
      body: {username, password},
    })
  },
}
