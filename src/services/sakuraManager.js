import request from '../utils/request'

export default {
  lists() {
    return request('/api/sakura')
  }
}
