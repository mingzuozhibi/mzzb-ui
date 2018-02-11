import request from '../utils/request'

export default {
  findAll() {
    return request('/api/users')
  }
}
