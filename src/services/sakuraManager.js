import request from '../utils/request'

export default {
  findAll(discColumns) {
    return request(`/api/sakuras?discColumns=${discColumns.join(',')}`)
  }
}
