import request from '../utils/request'

export default {
  lists(discColumns) {
    return request(`/api/sakura?discColumns=${discColumns.join(',')}`)
  }
}
