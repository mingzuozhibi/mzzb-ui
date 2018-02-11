import request from '../utils/request'

export default {
  sakuras(discColumns) {
    return request(`/api/sakura?discColumns=${discColumns.join(',')}`)
  }
}
