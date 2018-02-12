import request from '../utils/request'
import md5 from 'md5'

export default {
  listUser() {
    return request('/api/admin/users')
  },
  saveUser(username, password) {
    password = md5(username + md5(password))
    return request('/api/admin/users', {
      method: 'post',
      body: {username, password},
    })
  },
  editUser({id, ...user}) {
    if (user.password)
      user.password = md5(user.username + md5(user.password))
    return request(`/api/admin/users/${id}`, {
      method: 'post',
      body: {...user},
    })
  },
}
